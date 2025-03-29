<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";

// const { width, height } = useWindowSize();

const width = ref();

onMounted(() => {
  width.value = useWindowSize().width;
});
</script>

<template>
  <v-carousel
    show-arrows="hover"
    hide-delimiter-background
    interval="3000"
    height="100%"
    cycle
    class="carousel"
  >
    <NuxtLink :to="`/kategoria/victoria-vynn-forget-me-nude`">
      <v-carousel-item>
        <nuxt-img
          src="/forgetmenude.webp"
          loading="eager"
          importance="high"
          alt="vv-forget-me-nude"
          format="webp"
          quality="80"
          class="w-full h-full object-cover"
          :sizes="[320, 640, 768, 1024, 1280, 2000]"
          fit="cover"
        />
      </v-carousel-item>
    </NuxtLink>
    <NuxtLink :to="`/kategoria/pb-nails-nowe-ceny`">
      <v-carousel-item>
        <nuxt-img
          src="/web.webp"
          loading="lazy"
          importance="low"
          alt="pb-nails-nowe-ceny"
          format="webp"
          quality="80"
          class="w-full h-full object-cover"
          :sizes="[320, 640, 768, 1024, 1280, 2000]"
          fit="cover"
        />
      </v-carousel-item>
    </NuxtLink>
    <NuxtLink :to="`/kategoria/victoria-vynn-mousse`">
      <v-carousel-item>
        <nuxt-img
          src="/vynn_vv_MOUSSE_HDT_FREE_banery_dystr_www_2000x600.webp"
          loading="lazy"
          importance="low"
          alt="vv-mousse"
          format="webp"
          quality="80"
          class="w-full h-full object-cover"
          :sizes="[320, 640, 768, 1024, 1280, 2000]"
          fit="cover"
        />
      </v-carousel-item>
    </NuxtLink>
    <NuxtLink :to="`/kategoria/victoria-vynn-easy-fiber-gel`">
      <v-carousel-item>
        <nuxt-img
          src="/vynn_vv_EASY_fiber_HDT_FREE_banery_dystr_www_2000x600.webp"
          loading="lazy"
          importance="low"
          alt="vv-easy-fiber"
          format="webp"
          quality="80"
          class="w-full h-full object-cover"
          :sizes="[320, 640, 768, 1024, 1280, 2000]"
          fit="cover"
        />
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
