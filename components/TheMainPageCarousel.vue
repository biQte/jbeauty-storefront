<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";

// const { width, height } = useWindowSize();

const width = ref();

const cycle = ref(false);

onMounted(() => {
  width.value = useWindowSize().width;

  setTimeout(() => {
    cycle.value = true;
  }, 5000);
});
</script>

<template>
  <v-carousel
    show-arrows="hover"
    hide-delimiter-background
    interval="3000"
    height="100%"
    :cycle="cycle"
    class="carousel"
  >
    <NuxtLink :to="'/promocje'" aria-label="promocje">
      <v-carousel-item>
        <TheMainPageCarouselItem desktop="/baner-desktop.webp" mobile="/baner-mobile.webp" alt="promocje" placeholder="/baner-desktop-placeholder.webp" mobile-placeholder="/baner-mobile-placeholder.webp" :is-first="true" />
      </v-carousel-item>
    </NuxtLink>
    <NuxtLink :to="'/kategoria/victoria-vynn-vitamin-boost-base'" aria-label="vitamin-boost-base">
      <v-carousel-item>
        <TheMainPageCarouselItem desktop="/vv-boost-base.webp" mobile="/vv-boost-base-mobile.webp" alt="vv-boost-base" placeholder="/vv-boost-base-placeholder.webp" mobile-placeholder="/vv-boost-base-mobile-placeholder.webp" />
      </v-carousel-item>
    </NuxtLink>
    <NuxtLink :to="`/kategoria/victoria-vynn-buildmania`" aria-label="build-mania">
      <v-carousel-item>
        <TheMainPageCarouselItem desktop="/build-mania-desktop.webp" mobile="build-mania-mobile.webp" alt="vv-buildmania" placeholder="/build-mania-desktop-placeholder.webp" mobile-placeholder="/build-mania-mobile-placeholder.webp" />
      </v-carousel-item>
    </NuxtLink>
    <NuxtLink :to="`/kategoria/victoria-vynn-luna-glass`" aria-label="luna-glass">
      <v-carousel-item>
        <TheMainPageCarouselItem desktop="/luna-glass.webp" mobile="/luna-glass-mobile.webp" alt="vv-luna-glass" placeholder="/luna-glass-placeholder.webp" mobile-placeholder="/luna-glass-mobile-placeholder.webp" />
      </v-carousel-item>
    </NuxtLink>
    <NuxtLink :to="`/kategoria/pb-nails-nowe-ceny`" aria-label="pb-nails-nowe-ceny">
      <v-carousel-item>
        <TheMainPageCarouselItem desktop="/web.webp" mobile="/zele-nizsze-ceny-mobile.webp" alt="pb-nails-nowe-ceny" placeholder="/web-placeholder.webp" mobile-placeholder="/zele-nizsze-ceny-mobile-placeholder.webp" />
      </v-carousel-item>
    </NuxtLink>
  </v-carousel>
</template>

<style lang="scss" scoped>
.carousel-item-component {
  width: 100vw;
  display: flex;
  align-items: start;
  height: 100%;
  background: linear-gradient(
    to left,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.8) 100%
  );

  .content-wrapper {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    height: 100%;
    gap: 3rem;
    padding: 1rem 10rem;
    color: #ffffff;
  }
}
</style>
