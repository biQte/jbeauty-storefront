export default defineNuxtPlugin(() => {
  if (process.env.NODE_ENV !== "production") return;
  (function (h: any, o: any, t: any, j: any, a?: any, r?: any) {
    h.hj =
      h.hj ||
      function () {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
    h._hjSettings = {
      hjid: process.env.NUXT_HOTJAR_ID, // <-- tutaj wstaw swój ID z Hotjara
      hjsv: 6,
    };
    a = o.getElementsByTagName("head")[0];
    r = o.createElement("script");
    r.async = true;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
  })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
});
