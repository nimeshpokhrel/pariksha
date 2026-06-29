import React from "react";
import UploadThingImage from "../UploadThingImage";

export default function CarouselImage({ imageSrc, alt }) {
  return (
    <UploadThingImage
      src={imageSrc}
      height={180}
      width={320}
      alt={alt}
      className="rounded-t-md bg-gray-light"
      style={{
        width: "280px",
        aspectRatio: "16/10",
      }}
    />
  );
}
