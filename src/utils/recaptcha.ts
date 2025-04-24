/**
 * Utility functions for Google reCAPTCHA v3 verification
 */

/**
 * Verifies a reCAPTCHA v3 token with Google's API
 * @param token The reCAPTCHA token from the client
 * @param action The expected action name
 * @param minScore The minimum score to consider valid (0.0 to 1.0, where 1.0 is very likely a human)
 * @returns An object with verification results
 */
export async function verifyRecaptcha(token: string, action: string, minScore: number = 0.5) {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    // If no secret key is configured, consider it a pass in development
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️ reCAPTCHA secret key not configured, skipping verification in development');
      return { 
        success: true, 
        score: 1.0, 
        action: action, 
        devMode: true
      };
    }
    console.error('RECAPTCHA_SECRET_KEY environment variable not set');
    throw new Error('reCAPTCHA secret key not configured');
  }

  if (!token) {
    return { success: false, error: 'Missing reCAPTCHA token' };
  }

  try {
    // Verify the token with Google's reCAPTCHA API
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: 'POST' }
    );

    if (!response.ok) {
      console.error('reCAPTCHA API error:', response.status, response.statusText);
      return { 
        success: false, 
        error: `reCAPTCHA API error: ${response.status} ${response.statusText}` 
      };
    }

    const data = await response.json();
    
    // Debug information in development mode
    if (process.env.NODE_ENV !== 'production') {
      console.log('reCAPTCHA verification result:', {
        success: data.success,
        score: data.score,
        action: data.action,
        hostname: data.hostname,
        challengeTs: data['challenge_ts']
      });
    }

    // Check verification was successful
    if (!data.success) {
      return { 
        success: false, 
        error: `reCAPTCHA verification failed: ${data['error-codes']?.join(', ') || 'Unknown error'}` 
      };
    }

    // Verify the action matches what we expect
    if (action && data.action !== action) {
      return {
        success: false,
        error: `reCAPTCHA action mismatch: expected '${action}', got '${data.action}'`,
        score: data.score
      };
    }

    // Check score meets our threshold
    if (data.score < minScore) {
      return {
        success: false,
        error: `reCAPTCHA score too low: ${data.score.toFixed(2)} (minimum: ${minScore})`,
        score: data.score
      };
    }

    // All checks passed
    return {
      success: true,
      score: data.score,
      action: data.action
    };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, error: 'reCAPTCHA verification failed' };
  }
} 