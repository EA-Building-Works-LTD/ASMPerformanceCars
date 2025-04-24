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
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useRecaptcha } from '@/hooks/useRecaptcha';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  chosenVehicle: z.string(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  // Part Exchange Details
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  registration: z.string().min(1, 'Registration is required'),
  mileage: z.string().min(1, 'Mileage is required'),
  gearbox: z.string().min(1, 'Gearbox is required'),
  fuelType: z.string().min(1, 'Fuel type is required'),
  carColor: z.string().min(1, 'Car color is required'),
  interiorType: z.string().min(1, 'Interior type is required'),
  serviceHistory: z.string().min(1, 'Service history is required'),
  previousOwners: z.string().min(1, 'Previous owners is required'),
  hpiClear: z.string().min(1, 'HPI clear status is required'),
  conditionDescription: z.string().min(10, 'Condition description must be at least 10 characters'),
  askingPrice: z.string().min(1, 'Asking price is required'),
  honeypot: z.string().max(0, 'Bot detected'),
});

type FormValues = z.infer<typeof formSchema>;

interface PartExchangeFormProps {
  isOpen: boolean;
  onClose: () => void;
  chosenVehicle: string;
}

export default function PartExchangeForm({ isOpen, onClose, chosenVehicle }: PartExchangeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Initialize reCAPTCHA hook
  const { getToken, isLoading: isRecaptchaLoading, isLoaded: isRecaptchaLoaded, error: recaptchaError } = useRecaptcha('part_exchange');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chosenVehicle,
      honeypot: '',
      gearbox: '',
      fuelType: '',
      serviceHistory: '',
      hpiClear: ''
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Check honeypot field to prevent spam
      if (data.honeypot && data.honeypot.length > 0) {
        // Silently return without submitting if honeypot is filled (likely a bot)
        // But show fake success to the bot
        setSubmitSuccess(true);
        setTimeout(() => {
          onClose();
          setSubmitSuccess(false);
        }, 2000);
        return;
      }
      
      // Check if reCAPTCHA is loaded
      if (!isRecaptchaLoaded) {
        throw new Error("Verification service is not available. Please refresh and try again.");
      }
      
      // Get reCAPTCHA token
      const recaptchaToken = await getToken();
      
      if (!recaptchaToken) {
        throw new Error("Verification failed. Please refresh and try again.");
      }

      const response = await fetch('/api/send-part-exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          recaptchaToken,
          recaptchaAction: 'part_exchange'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Success
      setSubmitSuccess(true);
      toast.success('Your part exchange request has been sent successfully!');
      reset();
      
      // Close the form after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
      toast.error(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
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
      <DialogContent className="sm:max-w-[1100px] bg-zinc-900 border-zinc-800 max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Part Exchange for {chosenVehicle}
          </DialogTitle>
          <p className="text-gray-400 text-sm mt-2">
            Please fill in your details below and we'll get back to you shortly.
          </p>
        </DialogHeader>

        {submitSuccess ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Part Exchange Request Submitted</h3>
            <p className="text-gray-400">Thank you for your part exchange request. We'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {submitError && (
              <div className="bg-red-900/30 border border-red-700 p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{submitError}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:divide-x md:divide-zinc-700">
              {/* Personal Details Section - Left Column on desktop, top section on mobile */}
              <div className="space-y-4 md:pr-4">
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

                <div className="space-y-2">
                  <Label htmlFor="chosenVehicle" className="text-white">Chosen Vehicle *</Label>
                  <div className="relative">
                    <Input
                      id="chosenVehicle"
                      {...register('chosenVehicle')}
                      readOnly
                      className="bg-zinc-800 border-zinc-700 text-white pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-400 text-sm">Locked</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">Message *</Label>
                  <Textarea
                    id="message"
                    {...register('message')}
                    className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                    placeholder="Tell us about your requirements..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm">{errors.message.message}</p>
                  )}
                </div>
              </div>

              {/* Part Exchange Details Section - Right Column on desktop, bottom section on mobile */}
              <div className="space-y-4 md:pl-4 border-t border-zinc-700 pt-4 md:border-t-0 md:pt-0">
                <h3 className="text-lg font-semibold text-white border-b border-zinc-700 pb-2">Part Exchange Details</h3>
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
                    <Label htmlFor="mileage" className="text-white">Mileage *</Label>
                    <Input
                      id="mileage"
                      {...register('mileage')}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    {errors.mileage && (
                      <p className="text-red-500 text-sm">{errors.mileage.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gearbox" className="text-white">Gearbox *</Label>
                    <Select onValueChange={(value: string) => setValue('gearbox', value)}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select gearbox" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="semi-automatic">Semi-Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register('gearbox')} />
                    {errors.gearbox && (
                      <p className="text-red-500 text-sm">{errors.gearbox.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuelType" className="text-white">Fuel Type *</Label>
                    <Select onValueChange={(value: string) => setValue('fuelType', value)}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register('fuelType')} />
                    {errors.fuelType && (
                      <p className="text-red-500 text-sm">{errors.fuelType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carColor" className="text-white">Car Color *</Label>
                    <Input
                      id="carColor"
                      {...register('carColor')}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    {errors.carColor && (
                      <p className="text-red-500 text-sm">{errors.carColor.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interiorType" className="text-white">Interior Type *</Label>
                    <Input
                      id="interiorType"
                      {...register('interiorType')}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    {errors.interiorType && (
                      <p className="text-red-500 text-sm">{errors.interiorType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceHistory" className="text-white">Service History *</Label>
                    <Select onValueChange={(value: string) => setValue('serviceHistory', value)}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select service history" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Service History</SelectItem>
                        <SelectItem value="partial">Partial Service History</SelectItem>
                        <SelectItem value="none">No Service History</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register('serviceHistory')} />
                    {errors.serviceHistory && (
                      <p className="text-red-500 text-sm">{errors.serviceHistory.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="previousOwners" className="text-white">Previous Owners *</Label>
                    <Input
                      id="previousOwners"
                      {...register('previousOwners')}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    {errors.previousOwners && (
                      <p className="text-red-500 text-sm">{errors.previousOwners.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hpiClear" className="text-white">HPI Clear *</Label>
                    <Select onValueChange={(value: string) => setValue('hpiClear', value)}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select HPI status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register('hpiClear')} />
                    {errors.hpiClear && (
                      <p className="text-red-500 text-sm">{errors.hpiClear.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="askingPrice" className="text-white">Asking Price *</Label>
                    <Input
                      id="askingPrice"
                      {...register('askingPrice')}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    {errors.askingPrice && (
                      <p className="text-red-500 text-sm">{errors.askingPrice.message}</p>
                    )}
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="conditionDescription" className="text-white">Condition Description *</Label>
                    <Textarea
                      id="conditionDescription"
                      {...register('conditionDescription')}
                      className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                      placeholder="Describe the condition of your vehicle..."
                    />
                    {errors.conditionDescription && (
                      <p className="text-red-500 text-sm">{errors.conditionDescription.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Honeypot field */}
            <input
              type="text"
              {...register('honeypot')}
              className="hidden"
            />

            {/* reCAPTCHA status */}
            {!isRecaptchaLoaded && (
              <div className="text-amber-500 text-xs flex items-center mt-2">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Loading verification service...
              </div>
            )}

            {recaptchaError && (
              <div className="text-red-500 text-xs flex items-center mt-2">
                <AlertCircle className="w-3 h-3 mr-1" />
                Verification service error - please refresh
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
              disabled={isSubmitting || isRecaptchaLoading || !isRecaptchaLoaded || !!recaptchaError}
            >
              {isSubmitting || isRecaptchaLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSubmitting ? "Submitting..." : "Verifying..."}
                </span>
              ) : (
                "Send Part Exchange Request"
              )}
            </Button>
            
            <p className="text-xs text-gray-400 text-center">
              By submitting this form, you agree to our Privacy Policy
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 