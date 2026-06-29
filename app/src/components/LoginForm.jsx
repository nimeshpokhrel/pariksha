"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/hooks/auth";
import Link from "next/link";
import Spinner from "@/utils/Spinner";
import { useAuth } from "@/utils/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "./Input";
import { FaUser } from "react-icons/fa";

import { IoMdLock } from "react-icons/io";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700"], // or ["400", "700"] if needed
});

const loginSchema = z.object({
  identifier: z.union([
    z.string().trim().email("Invalid email address or phone number"),
    z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Invalid email address or phone number"),
  ]),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const LoginForm = () => {
  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (user) router.replace(`${redirect}`);
  }, [user]);

  const {
    register,
    handleSubmit,
    setError: setLoginDetailsError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const userLogin = useMutation({
    mutationFn: (formData) => loginUser(formData),
    onSuccess: login,
    onError: (error) => {
      error.response.data.errors.map((e) => {
        for (let key in e) {
          setLoginDetailsError(key, {
            type: "manual",
            message: e[key],
          });
        }
      });
    },
  });

  const onSubmit = (data, event) => {
    event.preventDefault();
    userLogin.mutate(data);
  };

  return (
    <>
      {userLogin.isPending && <Spinner />}
      <div className="flex h-full w-full flex-col items-center pt-8 lg:justify-center lg:pt-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col"
        >
          <h1
            className={`${cinzel.className} text-bold text-center text-4xl text-primary`}
          >
            WELCOME
          </h1>
          <p className="font-black/50 mb-8 mt-1 text-center text-xs">
            Login to your account
          </p>
          <Input
            name={"identifier"}
            register={register}
            error={errors.identifier}
            placeholder="Email or Phone"
            className="w-full rounded-full border-b-0 bg-[#EBEBEB] px-8 py-4 pl-14 text-sm text-primary placeholder-primary/60 focus:ring-1 focus:ring-primary/90"
            leftIcon={<FaUser size={18} className="-mt-1 text-primary" />}
          />

          <div className="mb-0.5 flex justify-end pr-6 text-sm font-semibold text-primary">
            <Link
              href={`/login/forgotPassword?redirect=${redirect}`}
              className="text-primary"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            name={"password"}
            register={register}
            error={errors.password}
            type="password"
            placeholder="Password"
            className="w-full rounded-full border-b-0 bg-[#EBEBEB] px-14 py-4 text-sm text-primary placeholder-primary/60 focus:ring-1 focus:ring-primary/90"
            leftIcon={<IoMdLock size={20} className="-mt-1 text-primary" />}
          />

          <button
            type="submit"
            className="m-auto mt-4 w-full rounded-full bg-primary px-14 py-2.5 text-white"
          >
            Login
          </button>
        </form>
        <div className="mt-10 flex justify-center">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?&nbsp;
            <Link
              href={`/login/register?redirect=${redirect}`}
              className="font-semibold text-primary"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
