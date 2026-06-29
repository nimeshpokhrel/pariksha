import NoHookFormInput from "@/components/FormInputs/NoHookFormInput";
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { UploadButton } from "@/utils/uploadthing";
import { UploadDropzone } from "@uploadthing/react";

export default function AddQuestionAnswer({ handleChange, label, answer }) {
  const [imageAnswer, setImageAnswer] = useState(answer.type === "image");

  const switchChangeHandler = (checked) => {
    handleChange({ text: null, type: checked ? "image" : "text" });
    setImageAnswer(checked);
  };
  const imageUploadComplete = async (res) => {
    handleChange({ text: res[0].key, type: "image" });
  };

  return (
    <div className="relative">
      <div className="absolute right-0 top-0 flex items-center gap-2">
        <Switch
          id="imageAnswer"
          onCheckedChange={switchChangeHandler}
          checked={imageAnswer}
        />
        <label htmlFor="imageAnswer" className="text-xs">
          Image
        </label>
      </div>
      {!imageAnswer && (
        <NoHookFormInput
          name={`answer`}
          label={label}
          placeHolder={`Enter Answer`}
          defaultValue={answer.text}
          required={true}
          onChange={(e) => handleChange({ text: e.target.value, type: "text" })}
        />
      )}
      {imageAnswer && (
        <div className="mb-8 flex flex-col gap-4">
          <label className="mb-1 pl-2 text-xs text-gray-500">{label}</label>
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={imageUploadComplete}
            onUploadError={(error) => {
              alert(`ERROR! ${error.message}`);
            }}
            className="mt-0 py-4"
          />
        </div>
      )}
    </div>
  );
}
