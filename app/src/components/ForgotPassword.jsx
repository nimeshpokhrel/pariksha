"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import * as z from "zod";
import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import {
  getUserDetails,
  resetPassword,
  sendOtp,
  verifyOtp,
} from "@/hooks/auth";
import { useRouter } from "next/navigation";
import Countdown from "react-countdown";
import Spinner from "@/utils/Spinner";
import Input from "@/components/Input";
import { useSearchParams } from "next/navigation";
import { FaAngleLeft, FaUser } from "react-icons/fa";

const identifierSchema = z.object({
  identifier: z.union([
    z.string().trim().email("Invalid email address or phone number"),
    z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Invalid email address or phone number"),
  ]),
});

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .refine((s) => !s.includes(" "), "Password cannot contain spaces"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .refine((s) => !s.includes(" "), "Password cannot contain spaces"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ForgotPassword() {
  const [formStage, setFormStage] = useState("identifierInput");
  const [otpValue, setOtpValue] = useState(null);
  const [otpError, setOtpError] = useState(false);
  const [emailOtp, setEmailOtp] = useState(true);
  const [countdownRunning, setCountdownRunning] = useState(false);
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const checkUser = useMutation({
    mutationFn: (identifier) => getUserDetails(identifier),
    onSuccess: (data) => {
      setEmail(data.data.email);
      setContact(data.data.contactNumber);
      sendUserOtp.mutate(data.data.email);
    },
    onError: (error) => {
      setLoginDetailsError("identifier", {
        type: "manual",
        message: "No user with this email or contact number found.",
      });
    },
  });
  const sendUserOtp = useMutation({
    mutationFn: (number) => sendOtp(number),
    onSuccess: (error) => {
      setFormStage("otp");
    },
    onError: (error) => {
      setLoginDetailsError("identifier", {
        type: "manual",
        message: "Error while sending OTP please try again later.",
      });
    },
  });
  const otpVerify = useMutation({
    mutationFn: ({ identifier, otp }) => verifyOtp(identifier, otp),
    onSuccess: (data, variables) => {
      setOtpValue(variables.otp);
      setFormStage("passwordInput");
    },
    onError: (error) => setOtpError(true),
  });

  const passwordReset = useMutation({
    mutationFn: (formData) => resetPassword(formData),
    onSuccess: (data) => {
      toast({
        title: "Password Changed.",
        description: "Your password has been changed successfully.",
        status: "success",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
      router.replace(`/login?redirect=${redirect}`);
    },
    onError: () => {
      toast({
        title: "Error Occured.",
        description: "There was an error while changing your password.",
        status: "error",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const {
    register,
    handleSubmit: confirmIdentifier,
    setError: setLoginDetailsError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(identifierSchema),
  });

  const {
    register: passwordRegister,
    handleSubmit: passwordHandleSubmit,
    setError: setPasswordError,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const setIdentifier = (data, event) => {
    event.preventDefault();
    checkUser.mutate(data.identifier);
  };

  const sendEmailOtp = () => {
    setCountdownRunning(true);
    setEmailOtp(true);
    sendUserOtp.mutate(email);
  };
  const sendNumberOtp = () => {
    setCountdownRunning(true);
    setEmailOtp(false);
    sendUserOtp.mutate(contact);
  };

  const submitOtp = (value) => {
    otpVerify.mutate({ identifier: emailOtp ? email : contact, otp: value });
  };
  const changePassword = (data, event) => {
    event.preventDefault();
    passwordReset.mutate({
      identifier: emailOtp ? email : contact,
      otp: otpValue,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  };

  return (
    <>
      {(checkUser.isPending ||
        otpVerify.isPending ||
        passwordReset.isPending) && <Spinner />}
      <div className="flex h-full w-full flex-col items-center pt-8 lg:justify-center lg:pt-0">
        <h1
          className={`mb-8 w-full text-left text-3xl font-extrabold text-primary`}
        >
          Reset Password
        </h1>
        {formStage === "identifierInput" && (
          <form
            onSubmit={confirmIdentifier(setIdentifier)}
            className="flex w-full flex-col"
          >
            <Input
              name={"identifier"}
              register={register}
              error={errors.identifier}
              placeholder="Email or Phone"
              className="w-full rounded-full bg-[#EBEBEB] px-8 py-4 pl-14 text-sm text-primary placeholder-primary/60 focus:ring-1 focus:ring-primary/90"
              leftIcon={<FaUser size={18} className="-mt-1 text-primary" />}
            />

            <button
              type="submit"
              className="m-auto mt-0 w-full rounded-full bg-primary px-14 py-2.5 text-white"
            >
              Continue
            </button>
          </form>
        )}
        {formStage === "otp" && (
          <div className="flex w-full flex-col items-center justify-center">
            <div className="w-full">
              <button
                type="button"
                className="mb-8 flex items-center gap-1 text-black"
                onClick={() => setFormStage("identifierInput")}
              >
                <FaAngleLeft size={16} color="gray" />{" "}
                <span className="underline">Back</span>
              </button>
            </div>
            <p className="mb-6 text-sm text-gray-700">
              Please enter the OTP sent to your registered{" "}
              {emailOtp ? "email" : "phone number"}.
            </p>
            <HStack>
              <PinInput
                onChange={() => setOtpError(false)}
                onComplete={(value) => submitOtp(value)}
                autoFocus
                otp
              >
                <PinInputField
                  borderColor={otpError ? "red" : "blackAlpha.400"}
                />
                <PinInputField
                  borderColor={otpError ? "red" : "blackAlpha.400"}
                />
                <PinInputField
                  borderColor={otpError ? "red" : "blackAlpha.400"}
                />
                <PinInputField
                  borderColor={otpError ? "red" : "blackAlpha.400"}
                />
                <PinInputField
                  borderColor={otpError ? "red" : "blackAlpha.400"}
                />
                <PinInputField
                  borderColor={otpError ? "red" : "blackAlpha.400"}
                />
              </PinInput>
            </HStack>
            {otpError && (
              <span className="mt-3 text-sm text-red-500">Invalid OTP.</span>
            )}
            <p className="mt-8 text-sm font-normal text-gray-500">
              Didn&apos;t receive the OTP? Resend{" "}
              {countdownRunning && (
                <>
                  in &nbsp;
                  <Countdown
                    date={Date.now() + 10000 * 6}
                    onComplete={() => setCountdownRunning(false)}
                    renderer={({ minutes, seconds }) => (
                      <span className="font-semibold text-gray-500 underline">
                        {minutes <= 9 ? `0${minutes}` : minutes}:
                        {seconds <= 9 ? `0${seconds}` : seconds}
                      </span>
                    )}
                  />
                </>
              )}
            </p>

            {!countdownRunning && (
              <div className="mt-2 flex gap-4">
                <button
                  className="font-semibold text-primary underline"
                  onClick={sendNumberOtp}
                >
                  SMS
                </button>
                <button
                  className="font-semibold text-primary underline"
                  onClick={sendEmailOtp}
                >
                  Email
                </button>
              </div>
            )}
          </div>
        )}
        {formStage === "passwordInput" && (
          <form
            onSubmit={passwordHandleSubmit(changePassword)}
            className="flex w-full flex-col"
          >
            <div>
              <button
                type="button"
                className="mb-8 flex items-center gap-1 text-black"
                onClick={() => setFormStage("identifierInput")}
              >
                <FaAngleLeft size={16} color="gray" />{" "}
                <span className="underline">Back</span>
              </button>
            </div>

            <p className="mb-8 border-b-[1.5px] border-b-primary pb-1 text-primary outline-none hover:cursor-not-allowed">
              {email}
            </p>

            <Input
              type="password"
              name="password"
              register={passwordRegister}
              error={passwordErrors.password}
              placeHolder="Password"
              className={
                "border-b-[1.5px] border-b-primary bg-transparent py-1 pl-1 text-primary placeholder-primary/80"
              }
            />

            <Input
              type="password"
              name="confirmPassword"
              register={passwordRegister}
              error={passwordErrors.confirmPassword}
              placeHolder="Confirm Password"
              className={
                "border-b-[1.5px] border-b-primary bg-transparent py-1 pl-1 text-primary placeholder-primary/80"
              }
            />

            <button
              type="submit"
              className="m-auto mt-0 w-full rounded-full bg-primary px-14 py-2.5 text-white"
            >
              Reset Password
            </button>
          </form>
        )}
        <div className="mt-14 flex justify-center">
          <p className="text-sm text-gray-500">
            Login to your account?&nbsp;
            <Link href="/login" className="font-semibold text-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
