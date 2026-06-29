"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiUrl } from "@/lib/config";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  contactNumber: z
    .string()
    .trim()
    .refine((value) => /^(98\d{8}|97\d{8})$/.test(value), {
      message: "Invalid Phone Number.",
    }),
  otp: z.string().trim().length(6, { message: "OTP must be 6 digits long." }),
  plusTwoCollege: z
    .string()
    .min(2, { message: "Please enter your +2 college" }),
  interestedDegree: z
    .string()
    .min(2, { message: "Please enter your interested degree" }),
  address: z.string().min(2, { message: "Please enter your address" }),
});

type FormValues = z.infer<typeof formSchema>;

interface CounsellingFormProps {
  onSuccess?: () => void;
}

export function CounsellingForm({ onSuccess }: CounsellingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contactNumber: "",
      otp: "",
      plusTwoCollege: "",
      interestedDegree: "",
      address: "",
    },
  });

  async function handleSendOtp() {
    const contactNumber = form.getValues("contactNumber");
    if (!/^(98\d{8}|97\d{8})$/.test(contactNumber)) {
      form.setError("contactNumber", {
        message: "Enter a valid phone number to receive an OTP.",
      });
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await fetch(`${apiUrl}/users/sendOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: contactNumber }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      setOtpSent(true);
      toast({
        title: "OTP sent",
        description: "An OTP has been sent to your phone number.",
      });
    } catch (error) {
      toast({
        title: "Could not send OTP",
        description: "Please try again later.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSendingOtp(false);
    }
  }

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiUrl}/counselling/addCounselling`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Failed to submit counselling form");
      }

      toast({
        title: "Request submitted successfully",
        description: "Our counsellor will reach out to you soon.",
      });

      form.reset();
      setOtpSent(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error submitting request",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <div className="flex items-start gap-2">
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="shrink-0"
                >
                  {isSendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP</FormLabel>
              <FormControl>
                <Input placeholder="Enter the 6-digit OTP" {...field} />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                {otpSent
                  ? "An OTP has been sent to your phone number."
                  : 'Click "Send OTP" above to receive a code on your phone.'}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plusTwoCollege"
          render={({ field }) => (
            <FormItem>
              <FormLabel>+2 College</FormLabel>
              <FormControl>
                <Input placeholder="Enter your +2 college" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interestedDegree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interested Degree</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. BSc CSIT, BBA, BIT"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Book Free Counselling"}
        </Button>
      </form>
    </Form>
  );
}
