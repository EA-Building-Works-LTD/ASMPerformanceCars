"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  subject: z.string().min(2, { message: 'Subject must be at least 2 characters long' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long' }),
  honeypot: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  title: string;
  subtitle?: string;
  submitButtonText: string;
  successMessage?: string;
}

export default function ContactForm({ 
  title, 
  subtitle, 
  submitButtonText,
  successMessage = 'Thank you for your message! We will get back to you shortly.',
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      honeypot: '',
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Check honeypot field to prevent spam
    if (data.honeypot) {
      // Silently return without submitting if honeypot is filled (likely a bot)
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Show success message
      setIsSuccess(true);
      toast.success(successMessage);
      reset();

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">{title}</h2>
      {subtitle && <p className="text-zinc-600 dark:text-zinc-300 mb-6">{subtitle}</p>}

      {isSuccess ? (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-900">
          <p className="text-green-800 dark:text-green-300">{successMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Honeypot field to prevent spam - hidden from users */}
          <div className="hidden">
            <input
              {...register('honeypot')}
              type="text"
              tabIndex={-1}
            />
          </div>
          
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-zinc-800 dark:text-white"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email *
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-zinc-800 dark:text-white"
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Phone (optional)
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-zinc-800 dark:text-white"
              placeholder="Your phone number"
            />
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Subject *
            </label>
            <input
              id="subject"
              type="text"
              {...register('subject')}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-zinc-800 dark:text-white"
              placeholder="What's this regarding?"
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.subject.message}</p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Message *
            </label>
            <textarea
              id="message"
              {...register('message')}
              rows={5}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-zinc-800 dark:text-white resize-none"
              placeholder="Your message..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending...
              </span>
            ) : (
              submitButtonText
            )}
          </button>
          
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4">
            Fields marked with * are required
          </p>
        </form>
      )}
    </div>
  );
} 