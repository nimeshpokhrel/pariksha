import React from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import { Button } from "@/components/ui/button";
import UploadThingImage from "../UploadThingImage";

export default function ImageInput({
  register,
  name,
  required,
  label,
  className,
  props,
  error,
  setValue,
  defaultValue = null,
}) {
  const [image, setImage] = React.useState(defaultValue);

  return (
    <div className="mb-8 w-full">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="ml-1 text-xs text-gray-500">
          {label} {required && " *"}
        </p>
        {image && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setImage(null);
              setValue(name, null);
            }}
          >
            Remove Image
          </Button>
        )}
      </div>
      <div className="relative h-full w-full">
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            setImage(res[0].key);
            setValue(name, res[0].key);
          }}
          onUploadError={(error) => {
            alert(`ERROR! ${error.message}`);
          }}
          className={`m-0 h-full w-full ${className}`}
          {...props}
        />
        {image && (
          <UploadThingImage
            src={`${image}`}
            alt={label}
            layout="fill"
            className="bg-white"
          />
        )}
      </div>
      <input type="hidden" {...register(name, { required })} />
      {error && <p className="mt-2 text-xs text-red-500">{error.message}</p>}
    </div>
  );
}
