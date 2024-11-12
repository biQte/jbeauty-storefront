// types/medusa.d.ts
import Medusa from "@medusajs/js-sdk";

declare module "#app" {
  interface NuxtApp {
    $medusaClient: Medusa;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $medusaClient: Medusa;
  }
}
