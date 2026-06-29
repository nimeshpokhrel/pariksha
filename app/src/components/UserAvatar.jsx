"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar({ src, name, fallback, size = "md", className }) {
  const [imageError, setImageError] = useState(false);

  // Generate initials from name
  const getInitials = () => {
    if (fallback) return fallback;
    if (!name) return "?";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Determine size class
  const sizeClass = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-3xl",
    xxl: "h-20 w-20 text-3xl md:h-40 md:w-40 md:text-6xl ",
  }[size];

  return (
    <Avatar className={`${sizeClass} ${className || ""}`}>
      {src && !imageError ? (
        <AvatarImage
          src={src || "/placeholder.svg"}
          alt={name || "Avatar"}
          onError={() => setImageError(true)}
        />
      ) : null}
      <AvatarFallback>{getInitials()}</AvatarFallback>
    </Avatar>
  );
}
