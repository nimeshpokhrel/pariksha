import { useId } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function TextEditorInput({
  height = "300px",
  label,
  defaultValue,
  displayValue,
  name,
  placeHolder,
  register,
  required,
  setValue,
  error,
  ...props
}) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [
        {
          color: [
            "#03747E",
            "#FD9801",
            "#0000000",
            "#FFFFFF",
            "#013F42",
            "rgba(217, 217, 217, 1)",
            "rgb(173,181,189)",
          ],
        },
        { background: [] },
      ],
      ["link", "image"],
    ],
  };
  const changeInput = (value) => {
    setValue(name, value);
  };
  const id = useId();

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="mb-1 pl-2 text-xs text-gray-500">
          {label}
          {required ? " *" : ""}
        </label>
      )}
      <textarea
        id={id}
        type="text"
        {...register(name, { required })}
        className={`hidden`}
        placeholder={placeHolder}
        {...props}
      />

      <ReactQuill
        theme="snow"
        value={defaultValue || displayValue}
        onChange={changeInput}
        placeholder={placeHolder || "Start Typing..."}
        modules={modules}
        style={{ height: height, marginBottom: "48px" }}
      />
      <div className="h-6">
        {error && <span className="text-xs text-red-500">{error.message}</span>}
      </div>
    </div>
  );
}
