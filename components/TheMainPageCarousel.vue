<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";

const { width, height } = useWindowSize();
</script>

<template>
  <!-- show-arrows="hover" -->
  <v-carousel
    show-arrows="hover"
    hide-delimiter-background
    :height="width * (9 / 16) * 0.7"
    interval="3000"
    cycle
  >
    <v-carousel-item src="@/assets/img/web.png" cover></v-carousel-item>
    <v-carousel-item src="@/assets/img/web.jpg" cover></v-carousel-item>
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
