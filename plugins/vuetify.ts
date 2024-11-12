import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";

const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: "#E42F7B",
  },
};

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    defaults: {
      global: {
        ripple: true,
        rounded: true,
      },
      VTextField: {
        variant: "solo-filled",
        density: "compact",
      },
      VButton: {
        // size: "large",
      },
    },
    theme: {
      defaultTheme: "myCustomLightTheme",
      themes: {
        myCustomLightTheme,
      },
    },
  });
  app.vueApp.use(vuetify);
});
