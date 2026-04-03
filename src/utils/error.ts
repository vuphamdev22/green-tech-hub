export const getErrorMessage = (error: unknown, fallback = "Something went wrong") => {
  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
    return axiosError.response?.data?.message ?? axiosError.message ?? fallback;
  }

  return fallback;
};

export const getHttpStatus = (error: unknown) => {
  if (typeof error === "object" && error !== null) {
    const axiosError = error as { response?: { status?: number } };
    return axiosError.response?.status;
  }
  return undefined;
};
