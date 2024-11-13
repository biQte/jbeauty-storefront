<script setup lang="ts">
const showCookiesBanner = ref<boolean>(false);

const getCookiesAcceptationFromStorage = () => {
  const cookies = localStorage.getItem("cookiesAccepted");

  console.log(cookies);

  if (!cookies || cookies !== "true") {
    showCookiesBanner.value = true;
  } else {
    showCookiesBanner.value = false;
  }
};

const checkForCookiesAcceptation = () => {
  getCookiesAcceptationFromStorage();
};

onMounted(() => {
  getCookiesAcceptationFromStorage();
});
</script>

<template>
  <div>
    <AppHeader />
    <main class="page-wrapper">
      <slot />
    </main>
    <AppFooter />
    <CookiesBanner
      v-if="showCookiesBanner"
      @accepted-cookies="checkForCookiesAcceptation"
    />
  </div>
</template>
