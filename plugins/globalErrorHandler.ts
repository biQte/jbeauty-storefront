import { FetchError } from "@medusajs/js-sdk";

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) {
    // Kod nie powinien być wykonywany na serwerze
    return;
  }

  const snackbarStore = useSnackbarStore();

  nuxtApp.vueApp.config.errorHandler = (error, vm, info) => {
    if (error instanceof FetchError) {
      if (error.message === "Invalid email or password") {
        snackbarStore.showSnackbar("Nieprawidłowy email lub hasło", "error");
      } else if (error.message === "Identity with email already exists") {
        snackbarStore.showSnackbar(
          "Podany adres email jest już zajęty",
          "error"
        );
      } else if (error.message.includes("ProductVariant id not found")) {
        snackbarStore.showSnackbar(
          "Jeden z wybranych produktów jest już niedostępny",
          "error"
        );
      } else if (
        error.message.includes("does not have the required inventory")
      ) {
        snackbarStore.showSnackbar(
          "Niektóre produkty nie są dostępne w podanej ilości",
          "error"
        );
      } else {
        snackbarStore.showSnackbar(error.message, "error", 5000);
      }
    }
  };

  window.addEventListener("unhandledrejection", (event) => {
    if (event.reason instanceof FetchError) {
      if (event.reason.message === "Invalid email or password") {
        snackbarStore.showSnackbar("Nieprawidłowy email lub hasło", "error");
      } else if (
        event.reason.message === "Identity with email already exists"
      ) {
        snackbarStore.showSnackbar(
          "Podany adres email jest już zajęty",
          "error"
        );
      } else if (event.reason.message.includes("ProductVariant id not found")) {
        snackbarStore.showSnackbar(
          "Jeden z wybranych produktów jest już niedostępny",
          "error"
        );
      } else if (
        event.reason.message.includes("does not have the required inventory")
      ) {
        snackbarStore.showSnackbar(
          "Niektóre produkty nie są dostępne w podanej ilości",
          "error"
        );
      } else {
        snackbarStore.showSnackbar(event.reason.message, "error", 5000);
      }
    }
  });

  window.addEventListener("error", (event) => {
    if (event instanceof FetchError) {
      if (event.message === "Invalid email or password") {
        snackbarStore.showSnackbar("Nieprawidłowy email lub hasło", "error");
      } else if (event.message === "Identity with email already exists") {
        snackbarStore.showSnackbar(
          "Podany adres email jest już zajęty",
          "error"
        );
      } else if (event.message.includes("ProductVariant id not found")) {
        snackbarStore.showSnackbar(
          "Jeden z wybranych produktów jest już niedostępny",
          "error"
        );
      } else if (
        event.message.includes("does not have the required inventory")
      ) {
        snackbarStore.showSnackbar(
          "Niektóre produkty nie są dostępne w podanej ilości",
          "error"
        );
      } else {
        snackbarStore.showSnackbar(event.message, "error", 5000);
      }
    }
  });
});
