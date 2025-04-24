#!/usr/bin/env node

/**
 * Environment variable setup script for ASM Performance Cars
 * 
 * This script helps to check and set up required environment variables
 * for the project.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define environment files
const envFile = path.join(__dirname, '..', '.env.local');
const exampleEnvFile = path.join(__dirname, '..', '.env.example');

// Required environment variables
const requiredVars = {
  // reCAPTCHA variables (required for form submissions)
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: 'Google reCAPTCHA v3 site key',
  RECAPTCHA_SECRET_KEY: 'Google reCAPTCHA v3 secret key',
  
  // Email sending (optional)
  SMTP_HOST: 'SMTP server host (e.g., smtp.gmail.com)',
  SMTP_PORT: 'SMTP server port (e.g., 587)',
  SMTP_USER: 'SMTP username/email',
  SMTP_PASSWORD: 'SMTP password or app password',
  SMTP_FROM: 'From email address',
  SMTP_SECURE: 'Whether to use TLS (true/false)',
  
  // Rate limiting with Upstash Redis (optional)
  UPSTASH_REDIS_REST_URL: 'Upstash Redis REST URL',
  UPSTASH_REDIS_REST_TOKEN: 'Upstash Redis REST token'
};

// Group variables by importance
const criticalVars = ['NEXT_PUBLIC_RECAPTCHA_SITE_KEY', 'RECAPTCHA_SECRET_KEY'];
const optionalVars = Object.keys(requiredVars).filter(key => !criticalVars.includes(key));

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Main function
async function main() {
  console.log(`${colors.cyan}ASM Performance Cars - Environment Setup${colors.reset}`);
  console.log(`${colors.cyan}==========================================${colors.reset}\n`);
  
  // Check if .env.local exists
  const envExists = fs.existsSync(envFile);
  if (envExists) {
    console.log(`${colors.green}Found existing .env.local file${colors.reset}`);
    const content = fs.readFileSync(envFile, 'utf8');
    
    // Parse existing variables
    const existingVars = {};
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        existingVars[match[1]] = match[2];
      }
    });
    
    // Check for missing variables
    const missingCritical = criticalVars.filter(key => !existingVars[key]);
    const missingOptional = optionalVars.filter(key => !existingVars[key]);
    
    if (missingCritical.length === 0) {
      console.log(`${colors.green}✓ All critical environment variables are set${colors.reset}`);
    } else {
      console.log(`${colors.red}! Missing critical environment variables: ${missingCritical.join(', ')}${colors.reset}`);
      await promptForVariables(missingCritical, existingVars);
    }
    
    if (missingOptional.length > 0) {
      console.log(`${colors.yellow}! Missing optional environment variables: ${missingOptional.join(', ')}${colors.reset}`);
      const setupOptional = await question(`Would you like to set up optional variables now? (y/n) `);
      if (setupOptional.toLowerCase() === 'y') {
        await promptForVariables(missingOptional, existingVars);
      }
    }
    
    // Write updated variables back to file
    writeEnvFile(existingVars);
  } else {
    console.log(`${colors.yellow}No .env.local file found, creating one${colors.reset}`);
    
    // Create example env file if it doesn't exist
    if (!fs.existsSync(exampleEnvFile)) {
      createExampleEnvFile();
    }
    
    // Prompt for critical variables
    const vars = {};
    console.log(`${colors.magenta}Please provide the following critical environment variables:${colors.reset}`);
    await promptForVariables(criticalVars, vars);
    
    // Ask if user wants to set up optional variables
    const setupOptional = await question(`Would you like to set up optional variables now? (y/n) `);
    if (setupOptional.toLowerCase() === 'y') {
      await promptForVariables(optionalVars, vars);
    }
    
    writeEnvFile(vars);
  }
  
  // Verification message
  console.log(`\n${colors.green}Environment setup completed!${colors.reset}`);
  console.log(`${colors.cyan}Next steps:${colors.reset}`);
  console.log(`1. If you haven't set up reCAPTCHA, visit https://www.google.com/recaptcha/admin/create`);
  console.log(`2. Create a reCAPTCHA v3 key with your domain`);
  console.log(`3. Restart your development server with 'npm run dev'`);
  
  rl.close();
}

// Helper to prompt for variables
async function promptForVariables(variables, varsObj) {
  for (const key of variables) {
    const description = requiredVars[key] || key;
    const value = await question(`Enter ${key} (${description}): `);
    varsObj[key] = value;
  }
}

// Helper to write the env file
function writeEnvFile(vars) {
  const content = Object.entries(vars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(envFile, content, 'utf8');
  console.log(`${colors.green}✓ Environment variables saved to .env.local${colors.reset}`);
}

// Helper to create example env file
function createExampleEnvFile() {
  const content = Object.entries(requiredVars)
    .map(([key, description]) => `# ${description}\n${key}=\n`)
    .join('\n');
  
  fs.writeFileSync(exampleEnvFile, content, 'utf8');
  console.log(`${colors.green}✓ Created .env.example file${colors.reset}`);
}

// Helper function to ask a question
function question(query) {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}

// Run the main function
main().catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
}); 