import React from "react";
import Image from "next/image";

export default function UploadThingImage({ src, className, alt, ...props }) {
  return (
    <Image
      src={src ? `https://utfs.io/f/${src}` : "/placeholder.svg"}
      alt={alt}
      className={className}
      {...props}
    />
  );
}
