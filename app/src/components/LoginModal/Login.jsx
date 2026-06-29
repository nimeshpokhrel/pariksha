"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/hooks/auth";
import Image from "next/image";
import Link from "next/link";
import Spinner from "@/utils/Spinner";
import { useAuth } from "@/utils/AuthContext";
import Input from "../Input";

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

const Login = ({ redirect }) => {
  const { login } = useAuth();

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
    <div>
      <div className="m-auto flex h-full w-full max-w-96 flex-col items-center justify-between bg-white py-8">
        {userLogin.isPending && <Spinner />}
        <Image
          src={"/logo/ParikshaLogo.png"}
          width={200}
          height={100}
          alt="Pariksha"
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-20 flex w-full flex-col px-8"
        >
          <Input
            name={"identifier"}
            label={"Email or Phone"}
            register={register}
            error={errors.identifier}
          />

          <Input
            name={"password"}
            label={"Password"}
            register={register}
            error={errors.password}
            type="password"
          />

          <div className="mb-6 flex justify-end text-xs font-semibold text-primary">
            <Link
              href={`/login/forgotPassword?redirect=${redirect}`}
              className="text-primary"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="m-auto w-max rounded-xl bg-primary px-14 py-2.5 text-white"
          >
            Login
          </button>
        </form>
        <div className="mt-10 flex justify-center">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?&nbsp;
            <Link
              href={`/login/register?redirect=${redirect || "/"}`}
              className="font-semibold text-primary"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
