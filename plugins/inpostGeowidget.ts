export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    const script = document.createElement("script");
    script.src = "https://geowidget.inpost.pl/inpost-geowidget.js";
    script.defer = true;
    document.head.appendChild(script);
  }
});
