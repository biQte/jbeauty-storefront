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
    <NuxtLink :to="`/kategoria/victoria-vynn-just-base`">
      <v-carousel-item
        src="/public/VYNN_JustBase_DYSTR-KV_WWW_2000x600.jpg"
        contain
      ></v-carousel-item>
    </NuxtLink>
    <NuxtLink :to="`/kategoria/victoria-vynn-easy-fiber-gel`">
      <v-carousel-item
        src="/public/VYNN_VV_EasyFiberGel_banery_www_-2000x600.jpg"
        contain
      ></v-carousel-item>
    </NuxtLink>
    <NuxtLink :to="`/kategoria/victoria-vynn-mega-base-shimmer`">
      <v-carousel-item
        src="/public/VYNN_VV_MegaBaseX3_banery_www_2000x600.jpg"
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
