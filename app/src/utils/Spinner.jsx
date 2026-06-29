import { Spinner as Spin } from "@chakra-ui/react";

export default function Spinner() {
  return (
    <div
      className="spinnerContainer fixed inset-0 flex w-full items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      <Spin thickness="6px" speed="0.65s" emptyColor="gray.200" size="xl" />
    </div>
  );
}
