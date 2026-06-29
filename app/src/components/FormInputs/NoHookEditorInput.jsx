import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function NoHookEditorInput({
  label,
  defaultValue,
  name,
  placeHolder,
  required,
  onChange,
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
      ["clean"],
    ],
  };

  return (
    <div className="mb-8 flex flex-col">
      {label && (
        <label htmlFor={name} className="mb-1 pl-2 text-xs text-gray-500">
          {label}
          {required ? " *" : ""}
        </label>
      )}

      <ReactQuill
        theme="snow"
        value={defaultValue}
        onChange={onChange}
        placeholder={placeHolder || "Start Typing..."}
        modules={modules}
        style={{ height: "405px", marginBottom: "48px" }}
      />
    </div>
  );
}
