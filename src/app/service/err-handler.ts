import toast from "react-hot-toast";

export const handleError = (error: any): string => {
  console.error("Full error object:", error);

  // Helper function to show toast notifications
  const showToast = (message: string) => {
    toast(message, {
      icon: "❌",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
      position: "bottom-right",
    });
  };

  if (typeof error === "string") {
    showToast(error); // Show toast for string errors
    return error;
  }

  if (error.title && error.status === 400) {
    const message = error.title;
    showToast(message); // Show toast for validation errors
    return message;
  }

  if (error.message) {
    showToast(error.message); // Show toast for general errors
    return error.message;
  }

  const defaultMessage = "An unexpected error occurred. Please try again.";
  showToast(defaultMessage); // Show toast for unexpected errors
  return defaultMessage;
};
