<script setup lang="ts">
import { ROUTES } from "~/constants/routes";
</script>

<template>
  <div class="bg-[#fff0f5] border border-[#ffc2d1] rounded-md p-4 flex flex-col sm:flex-col justify-center items-center sm:items-center gap-4">
    <div>
      <p class="text-sm text-[#9f3355] text-center font-medium">
        Masz konto? Zaloguj się, aby skorzystać z zapisanych adresów i&nbsp;rabatów.
      </p>
    </div>
    <NuxtLink
      :to="`${ROUTES.LOGIN_PAGE}?redirect=koszyk`"
      class="bg-[#ff5c8a] text-white text-sm px-4 py-2 rounded hover:bg-[#e44e79] transition"
    >
      Zaloguj się
    </NuxtLink>
  </div>
</template>