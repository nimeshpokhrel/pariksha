import { useState, useEffect } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import { Button } from "@/components/ui/button";
import UploadThingImage from "../UploadThingImage";

export default function ImageInputMultiple({
  register,
  name,
  required,
  label,
  className,
  props,
  error,
  setValue,
  defaultValue = [],
}) {
  const [images, setImages] = useState(defaultValue);

  useEffect(() => setValue(name, images), [images]);

  return (
    <div className="mb-8 w-full">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="ml-1 text-xs text-gray-500">
          {label} {required && " *"}
        </p>
        {images && images.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setImages([]);
            }}
          >
            Remove All
          </Button>
        )}
      </div>
      <div className="relative h-full w-full">
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            const imagesKeys = res.map((image) => image.key);
            setImages((prev) => [...prev, ...imagesKeys]);
          }}
          onUploadError={(error) => {
            alert(`ERROR! ${error.message}`);
          }}
          className={`m-0 h-full w-full ${className}`}
          {...props}
        />

        {images && images.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {images.map((image) => (
              <div
                className="flex items-center justify-between gap-8 border p-4"
                key={image}
              >
                <UploadThingImage
                  src={`${image}`}
                  alt={label}
                  height={60}
                  width={60}
                />
                <p>{image}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const filteredImages = images.filter(
                      (imageFilter) => imageFilter !== image
                    );
                    setImages(filteredImages);
                  }}
                >
                  Remove Image
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <input type="hidden" {...register(name, { required })} />
      {error && <p className="mt-2 text-xs text-red-500">{error.message}</p>}
    </div>
  );
}
