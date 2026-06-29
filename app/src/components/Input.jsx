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
  noError,
  className,
  leftIcon,
  rightButton,
  rightButtonOnClick,
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
        {leftIcon && (
          <div className="absolute bottom-0 left-6 top-0 flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          type={
            type === "password" ? (passwordShow ? "text" : "password") : type
          }
          id={name}
          {...register(name, { valueAsNumber: type === "number" })}
          onWheel={(e) => e.target.blur()}
          defaultValue={defaultValue}
          className={`w-full border-b-2 border-gray-200 focus:outline-none ${className}`}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute bottom-0 right-6 top-0 text-primary hover:text-primary/70"
            onClick={() => setPasswordShow((prev) => !prev)}
          >
            {passwordShow ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
          </button>
        )}
        {rightButton && (
          <button
            type="button"
            className="absolute right-2 -top-2 text-sm text-primary hover:text-primary/70"
            onClick={rightButtonOnClick}
          >
            {rightButton}
          </button>
        )}
      </div>
      {!noError && (
        <div className="h-6">
          {error && (
            <span className="text-xs text-red-500">{error.message}</span>
          )}
        </div>
      )}
    </div>
  );
}
