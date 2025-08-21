"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitContactInquiryMutation } from "@/redux/api";
import { toast } from "sonner";

const contactSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  className?: string;
}

const ContactForm = ({ className }: ContactFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when error or success changes
  useEffect(() => {
    if (error || success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error, success]);
  const [
    submitContactInquiry,
    { isLoading: isSubmit, isError: isSubmitError, error: submitError },
  ] = useSubmitContactInquiryMutation();

  async function onSubmit(data: ContactFormValues) {
    setSuccess(null);
    setError(null);
    try {
      const res = await submitContactInquiry(data).unwrap();
      if (isSubmitError) {
        toast.error(submitError?.error || "Failed to send message");
        throw new Error(submitError?.error || "Failed to send message");
      }
      const result = res as { ticketNumber: string; message: string };
      if (!result || !result.ticketNumber) {
        throw new Error("Invalid response from server");
      }
      setError(null);
      setSuccess(null);
      // Display success message with ticket number
      toast.success(
        `Thank you for contacting us! Your ticket number is ${result.ticketNumber}. We will reach out to you as soon as possible.`
      );
      reset();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <form
      className={`space-y-6 ${className || ""}`}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {success && (
        <div className="bg-green-100 text-green-800 rounded-md p-3 mb-4 text-center">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 rounded-md p-3 mb-4 text-center">
          {error}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-charcoal-800 mb-2"
          >
            First Name
          </label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 bg-white focus:border-transparent ${
              errors.firstName ? "border-red-300" : "border-gray-300"
            }`}
            {...register("firstName")}
            aria-invalid={!!errors.firstName}
            required
          />
          {errors.firstName && (
            <p className="text-red-600 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-charcoal-800 mb-2"
          >
            Last Name
          </label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 bg-white focus:border-transparent ${
              errors.lastName ? "border-red-300" : "border-gray-300"
            }`}
            {...register("lastName")}
            aria-invalid={!!errors.lastName}
            required
          />
          {errors.lastName && (
            <p className="text-red-600 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-charcoal-800 mb-2"
        >
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 bg-white focus:border-transparent ${
            errors.email ? "border-red-300" : "border-gray-300"
          }`}
          {...register("email")}
          aria-invalid={!!errors.email}
          required
        />
        {errors.email && (
          <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-charcoal-800 mb-2"
        >
          Subject
        </label>
        <Input
          id="subject"
          type="text"
          placeholder="How can we help you?"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 bg-white focus:border-transparent ${
            errors.subject ? "border-red-300" : "border-gray-300"
          }`}
          {...register("subject")}
          aria-invalid={!!errors.subject}
          required
        />
        {errors.subject && (
          <p className="text-red-600 text-xs mt-1">{errors.subject.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-charcoal-800 mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          placeholder="Tell us about your framing needs..."
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none  focus:border-transparent resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          {...register("message")}
          aria-invalid={!!errors.message}
          required
        />
        {errors.message && (
          <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>
        )}
      </div>
      <Button
        className="w-full   font-semibold py-3 text-lg"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
};

export default ContactForm;
