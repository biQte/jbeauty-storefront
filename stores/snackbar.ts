export const useSnackbarStore = defineStore("snackbar", () => {
  const show = ref<boolean>(false);
  const message = ref<string>("");
  const color = ref<string>("info");
  const timeout = ref<number>(3000);

  const showSnackbar = (
    snackbarMessage: string,
    snackbarColor: string,
    showTime: number = 3000
  ) => {
    show.value = true;
    message.value = snackbarMessage;
    color.value = snackbarColor;
    timeout.value = showTime;

    setTimeout(() => hideSnackbar, showTime);
  };

  const hideSnackbar = () => {
    show.value = false;
    message.value = "";
    color.value = "info";
    timeout.value = 3000;
  };

  return {
    show,
    message,
    color,
    timeout,
    showSnackbar,
    hideSnackbar,
  };
});
