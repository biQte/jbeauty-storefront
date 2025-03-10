<script setup lang="ts">
// import type { Customer } from "@medusajs/client-types";
// const sessionStore = useSessionStore();

// await callOnce(async () => {
//   const { customer } = await client.auth.getSession();

//   sessionStore.session = customer as unknown as Customer;
// });
</script>

<template>
  <div>
    <NuxtLayout>
      <v-app>
        <NuxtPage class="page" />
      </v-app>
    </NuxtLayout>
    <GlobalSnackbar />
    <!-- <NuxtRouteAnnouncer />
    <NuxtWelcome /> -->
  </div>
</template>
