import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  // Vehicle Details
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  registration: z.string().min(1, 'Registration is required'),
  year: z.string().min(1, 'Year is required'),
  // Service Details
  serviceType: z.string().min(1, 'Service type is required'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  preferredTime: z.string().min(1, 'Preferred time is required'),
  additionalNotes: z.string().optional(),
  honeypot: z.string().max(0, 'Bot detected'),
});

type FormValues = z.infer<typeof formSchema>;

interface CarDetailingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CarDetailingForm({ isOpen, onClose }: CarDetailingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      honeypot: '',
      serviceType: '',
      preferredTime: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/send-car-detailing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send booking request');
      }

      // Success
      setSubmitSuccess(true);
      toast.success('Your car detailing booking has been sent successfully!');
      reset();
      
      // Close the form after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      setSubmitError('Failed to send booking request. Please try again.');
      toast.error('Failed to send booking request. Please try again.');
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
      <DialogContent className="sm:max-w-[800px] bg-zinc-900 border-zinc-800 max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Book Car Detailing Service
          </DialogTitle>
          <p className="text-gray-400 text-sm mt-2">
            Please fill in your details below and we'll get back to you shortly to confirm your booking.
          </p>
        </DialogHeader>

        {submitSuccess ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Booking Request Submitted</h3>
            <p className="text-gray-400">Thank you for your booking request. We'll be in touch shortly to confirm your appointment.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-zinc-700 pb-2">Personal Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Vehicle Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-zinc-700 pb-2">Vehicle Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make" className="text-white">Make *</Label>
                    <Input
                      id="make"
                      {...register('make')}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    {errors.make && (
                      <p className="text-red-500 text-sm">{errors.make.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-white">Model *</Label>
                    <Input
                      id="model"
                      {...register('model')}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    {errors.model && (
                      <p className="text-red-500 text-sm">{errors.model.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registration" className="text-white">Registration *</Label>
                    <Input
                      id="registration"
                      {...register('registration')}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    {errors.registration && (
                      <p className="text-red-500 text-sm">{errors.registration.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-white">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      {...register('year')}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    {errors.year && (
                      <p className="text-red-500 text-sm">{errors.year.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Details Section */}
              <div className="col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-zinc-700 pb-2">Service Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceType" className="text-white">Service Type *</Label>
                    <Select onValueChange={(value: string) => setValue('serviceType', value)}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic Detailing</SelectItem>
                        <SelectItem value="premium">Premium Detailing</SelectItem>
                        <SelectItem value="interior">Interior Only</SelectItem>
                        <SelectItem value="exterior">Exterior Only</SelectItem>
                        <SelectItem value="full">Full Detailing</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register('serviceType')} />
                    {errors.serviceType && (
                      <p className="text-red-500 text-sm">{errors.serviceType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredDate" className="text-white">Preferred Date *</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      {...register('preferredDate')}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    {errors.preferredDate && (
                      <p className="text-red-500 text-sm">{errors.preferredDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredTime" className="text-white">Preferred Time *</Label>
                    <Select onValueChange={(value: string) => setValue('preferredTime', value)}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9:00 AM - 12:00 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (1:00 PM - 4:00 PM)</SelectItem>
                        <SelectItem value="evening">Evening (4:00 PM - 7:00 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register('preferredTime')} />
                    {errors.preferredTime && (
                      <p className="text-red-500 text-sm">{errors.preferredTime.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes" className="text-white">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    {...register('additionalNotes')}
                    className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                    placeholder="Any specific requirements or concerns..."
                  />
                </div>
              </div>
            </div>

            {/* Honeypot field */}
            <input
              type="text"
              {...register('honeypot')}
              className="hidden"
            />

            {submitError && (
              <p className="text-red-500 text-sm">{submitError}</p>
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isSubmitting ? 'Sending...' : 'Book Service'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 