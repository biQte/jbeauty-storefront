<script setup lang="ts">
useSeoMeta({
  title: "JBeauty - Tworzenie konta",
  ogTitle: "JBeauty - Tworzenie konta",
});

definePageMeta({
  isAccessibleAfterLogin: false,
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
  <TheSignUpForm />
</template>

<style lang="scss" scoped></style>
