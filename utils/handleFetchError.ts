import { FetchError } from "@medusajs/js-sdk";

export const handleFetchError = (e: any) => {
  let message: string = "";
  let color: string = "error";
  let timeout: number = 3000;

  if (e instanceof FetchError) {
    if (e.message === "Invalid email or password") {
      message = "Nieprawidłowy email lub hasło";
    } else if (e.message === "Identity with email already exists") {
      message = "Podany adres email jest już zajęty";
    } else {
      message = e.message;
    }
  } else {
    message = "Wystąpił nieoczekiwany błąd";
    timeout = 5000;
  }

  return {
    message,
    color,
    timeout,
  };
};
