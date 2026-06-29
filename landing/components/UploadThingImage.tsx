import React from "react";
import Image, { ImageProps } from "next/image";

interface UploadThingImageProps extends Omit<ImageProps, "src"> {
  imageLink: string;
}

export default function UploadThingImage({
  imageLink,
  className,
  alt,
  ...props
}: UploadThingImageProps) {
  return (
    <Image
      src={imageLink ? `https://utfs.io/f/${imageLink}` : "/placeholder.svg"}
      alt={alt}
      className={className}
      {...props}
    />
  );
}
