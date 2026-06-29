import { useToast as useToastChakra } from "@chakra-ui/react";

const useToast = () => {
  const toast = useToastChakra();

  const showToast = ({
    title = "Something went wrong",
    description = "Something went wrong while processing your request",
    status = "error",
    duration = 5000,
    isClosable = true,
    position = "top",
  }) =>
    toast({
      title: title,
      position: position,
      description: description,
      status: status,
      duration: duration,
      isClosable: isClosable,
    });

  const showToastError = ({
    title,
    description,
    error,
    status,
    duration,
    isClosable,
  }) => {
    console.log(error);
    showToast({
      title:
        title ||
        error?.response?.statusText ||
        error?.data?.message ||
        "Something went wrong",
      description:
        description ||
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.data?.message ||
        "Something went wrong while processing your request",
      status: status || "error",
      duration: duration || 5000,
      isClosable: isClosable || true,
    });
  };

  const showToastSuccess = ({
    title,
    description,
    status,
    duration,
    isClosable,
  }) =>
    showToast({
      title: title || "Success",
      description: description || "Successfully updated",
      status: status || "success",
      duration: duration || 5000,
      isClosable: isClosable || true,
    });

  return { showToast, showToastError, showToastSuccess };
};

export default useToast;
