export default defineNuxtPlugin(() => {
  if(import.meta.client){
    setTimeout(() => {
      if (process.env.NODE_ENV !== "production") return;
      //@ts-expect-error
      (function (c: any, s: any, q: any, u: any, a: any, r: any, e: any) {
        c.hj =
          c.hj ||
          function () {
            (c.hj.q = c.hj.q || []).push(arguments);
          };
        c._hjSettings = { hjid: a };
        r = s.getElementsByTagName("head")[0];
        e = s.createElement("script");
        e.async = true;
        e.src = q + c._hjSettings.hjid + u;
        r.appendChild(e);
      })(
        window,
        document,
        `https://static.hj.contentsquare.net/c/csq-`,
        ".js",
        5362100
      );
    });
  }
});
