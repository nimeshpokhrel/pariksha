export default function DisplayData({ label, value, className }) {
  return (
    <div className={`m-full flex max-w-[350px] flex-col ${className}`}>
      {label && <label className="text-sm text-gray-500">{label} </label>}
      <p className="border-b border-solid border-gray-semiDark px-3 pb-1 outline-0">
        {value}
      </p>
    </div>
  );
}
