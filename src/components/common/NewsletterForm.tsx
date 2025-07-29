'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { API_BASE_URL } from '@/lib/auth';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

const NewsletterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(data: NewsletterFormValues) {
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to subscribe');
      }
      setSuccess('Thank you for subscribing to our newsletter!');
      reset();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <form className="gap-4 flex flex-col" onSubmit={handleSubmit(onSubmit)} noValidate>
      {success && <div className="bg-green-100 text-green-800 rounded-md p-3 text-center">{success}</div>}
      {error && <div className="bg-red-100 text-red-800 rounded-md p-3 text-center">{error}</div>}
      <div>
        <label htmlFor="newsletter-email" className="block text-sm font-medium text-charcoal-800 mb-2">Email Address</label>
        <Input
          id="newsletter-email"
          type="email"
          placeholder="you@example.com"
          className="w-full p-3 h-10"
          {...register('email')}
          aria-invalid={!!errors.email}
          required
        />
        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <Button className="w-full font-semibold py-3 text-lg" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
};

export default NewsletterForm; 