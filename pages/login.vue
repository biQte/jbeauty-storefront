<script setup lang="ts">
useSeoMeta({
  title: "JBeauty - Logowanie",
  ogTitle: "JBeauty - Logowanie",
});

definePageMeta({
  isAccesibleAfterLogin: false,
});

const config = useRuntimeConfig();
const route = useRoute();

useHead({
  link: [
    {
      rel: "canonical",
      href: `${config.public.storeUrl}${route.path}`,
    },
  ],
});
</script>

<template>
  <TheLoginForm />
</template>

<style lang="scss" scoped></style>
