"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Ban, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "@/components/ui/use-toast"

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Phone number is required").max(20, "Phone number is too long"),
  vehicle: z.string(),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
  honeypot: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export interface EnquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
  chosenVehicle: string;
}

export function EnquiryForm({ isOpen, onClose, chosenVehicle }: EnquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Initialize form with React Hook Form + zod validation
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      vehicle: chosenVehicle,
      message: "",
      honeypot: "",
    }
  });
  
  // Handle form submission with validation and error handling
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit enquiry');
      }
      
      // Success
      setSubmitSuccess(true);
      reset();
      
      // Success toast notification
      toast({
        title: "Enquiry Submitted",
        description: "Thank you for your enquiry. We'll be in touch shortly.",
        duration: 5000,
      });
      
      // Close the form after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Enquiry submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit enquiry');
      
      // Error toast notification
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : 'Failed to submit enquiry',
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form and state when dialog opens/closes
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        reset();
        setSubmitError(null);
        setSubmitSuccess(false);
      }, 300);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Enquiry for {chosenVehicle}
          </DialogTitle>
          <p className="text-gray-400 text-sm mt-2">
            Please fill the form below or call 07306 657 000
          </p>
        </DialogHeader>
        
        {submitSuccess ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Enquiry Submitted</h3>
            <p className="text-gray-400">Thank you for your enquiry. We'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {submitError && (
              <div className="bg-red-900/30 border border-red-700 p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{submitError}</p>
              </div>
            )}
            
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="name" className="text-white">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                className={`bg-zinc-800 border-zinc-700 text-white focus:ring-red-500 focus:border-red-500 ${
                  errors.name ? "border-red-600 focus:border-red-600 focus:ring-red-600" : ""
                }`}
                placeholder="Enter your name"
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="email" className="text-white">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={`bg-zinc-800 border-zinc-700 text-white focus:ring-red-500 focus:border-red-500 ${
                  errors.email ? "border-red-600 focus:border-red-600 focus:ring-red-600" : ""
                }`}
                placeholder="Enter your email"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="phone" className="text-white">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                className={`bg-zinc-800 border-zinc-700 text-white focus:ring-red-500 focus:border-red-500 ${
                  errors.phone ? "border-red-600 focus:border-red-600 focus:ring-red-600" : ""
                }`}
                placeholder="Enter your phone number"
                aria-invalid={errors.phone ? "true" : "false"}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
            
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="vehicle" className="text-white">
                Interested in <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="vehicle"
                  {...register("vehicle")}
                  value={chosenVehicle}
                  readOnly
                  className="bg-zinc-800 border-zinc-700 text-white pr-10"
                />
                <Ban className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="message" className="text-white">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                {...register("message")}
                className={`bg-zinc-800 border-zinc-700 text-white min-h-[100px] focus:ring-red-500 focus:border-red-500 ${
                  errors.message ? "border-red-600 focus:border-red-600 focus:ring-red-600" : ""
                }`}
                placeholder="Enter your message"
                aria-invalid={errors.message ? "true" : "false"}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
              )}
            </div>
            
            {/* Honeypot field - hidden from real users but attracts bots */}
            <div className="hidden" aria-hidden="true">
              <Label htmlFor="honeypot" className="sr-only">
                Leave this field empty
              </Label>
              <Input
                id="honeypot"
                type="text"
                autoComplete="off"
                {...register("honeypot")}
                tabIndex={-1}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : "Send Enquiry"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 