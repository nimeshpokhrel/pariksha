import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Input({
  name,
  type,
  label,
  register,
  error,
  defaultValue,
  required,
  ...props
}) {
  const [passwordShow, setPasswordShow] = useState(false);

  return (
    <div className="mb-4 flex w-full flex-col">
      <label htmlFor={name} className="mb-1 pl-2 text-xs text-gray-500">
        {label}
        {required ? " *" : ""}
      </label>
      <div className="relative w-full">
        <input
          type={
            type === "password" ? (passwordShow ? "text" : "password") : type
          }
          id={name}
          {...register(name)}
          defaultValue={defaultValue}
          className="w-full border-b-2 border-gray-200 pb-1 outline-none"
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute right-2 -mt-1 rounded-full px-[6px] py-[6px] text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            onClick={() => setPasswordShow((prev) => !prev)}
          >
            {passwordShow ? <FaEye /> : <FaEyeSlash />}
          </button>
        )}
      </div>
      <div className="h-6">
        {error && <span className="text-xs text-red-500">{error.message}</span>}
      </div>
    </div>
  );
}
