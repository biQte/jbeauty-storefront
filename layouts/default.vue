<script setup lang="ts">
const showCookiesBanner = ref<boolean>(false);

// Używamy useCookie do zarządzania ciasteczkiem 'cookiesAccepted
const cookiesAccepted = useCookie("cookiesAccepted", {
  default: () => false,
});

// Funkcja sprawdzająca akceptację ciasteczek
const checkForCookiesAcceptation = () => {
  showCookiesBanner.value = cookiesAccepted.value !== true;

  console.log(showCookiesBanner.value);
  console.log(cookiesAccepted.value);
};

const acceptCookies = () => {
  cookiesAccepted.value = true;
  checkForCookiesAcceptation();
};

// Inicjalne sprawdzenie akceptacji ciasteczek
checkForCookiesAcceptation();
</script>

<template>
  <div>
    <AppHeader />
    <main class="page-wrapper">
      <slot />
    </main>
    <AppFooter />
    <CookiesBanner v-if="showCookiesBanner" @accepted-cookies="acceptCookies" />
  </div>
</template>
