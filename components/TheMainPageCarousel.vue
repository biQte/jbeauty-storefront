<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";

const { width, height } = useWindowSize();
</script>

<template>
  <!-- show-arrows="hover" -->
  <!-- :height="width * (9 / 16) * 0.7" -->
  <v-carousel
    show-arrows="hover"
    hide-delimiter-background
    interval="3000"
    :height="Math.round(width * (3 / 10)) + 'px'"
    cycle
    class="carousel"
  >
    <!-- <NuxtLink :to="`/kategoria/pb-nails`">
      <v-carousel-item
        src="/public/black-weekend-web2.jpg"
        contain
      ></v-carousel-item>
    </NuxtLink> -->
    <!-- <NuxtLink :to="`/kategoria/victoria-vynn-black-friday`">
      <v-carousel-item src="/public/unnamed.jpg" contain></v-carousel-item>
    </NuxtLink> -->
    <NuxtLink :to="`/kategoria/pb-nails-nowe-ceny`">
      <v-carousel-item src="/public/web.webp" contain></v-carousel-item>
    </NuxtLink>
    <NuxtLink :to="`/kategoria/victoria-vynn-pomodoro`">
      <v-carousel-item
        src="/public/VYNN_VV_POMODORO_banery_www_-2000x600.webp"
        contain
      ></v-carousel-item>
    </NuxtLink>
    <NuxtLink :to="`/kategoria/victoria-vynn-mousse`">
      <v-carousel-item
        src="/public/vynn_vv_MOUSSE_HDT_FREE_banery_dystr_www_2000x600.webp"
        contain
      ></v-carousel-item>
    </NuxtLink>
    <NuxtLink :to="`/kategoria/victoria-vynn-easy-fiber-gel`">
      <v-carousel-item
        src="/public/vynn_vv_EASY_fiber_HDT_FREE_banery_dystr_www_2000x600.webp"
        contain
      ></v-carousel-item>
    </NuxtLink>
  </v-carousel>
</template>

<style lang="scss" scoped>
.carousel-item-component {
  width: 100%;
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
