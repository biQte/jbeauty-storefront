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
    <v-carousel-item
      src="https://vividsklep.pl/wp-content/uploads/2024/03/402652876_749359350558640_700289256991602556_n.jpg"
      cover
    >
      <!-- <div class="carousel-item-component">
        <div class="content-wrapper">
          <div class="title-wrapper">Tego kurde tytuł</div>
          <div class="text-wrapper">
            Tego kurde faja bele mole jakiś krótki opis
          </div>
          <div class="button-wrapper"><v-btn>CTA</v-btn></div>
        </div>
      </div> -->
    </v-carousel-item>

    <v-carousel-item
      src="https://vividsklep.pl/wp-content/uploads/2024/07/83047ec0370a5224d1ecd5dd9afe06230f759995_2024_06_25_bestsellerowe_pedzle_2w1_1920x1648_baner.webp"
      cover
    >
      <!-- <v-container class="fill-height d-flex flex-column">
        <v-row class="flex-grow-1" align="start">Tego kurde tytuł</v-row>
        <v-row class="flex-grow-1" align="center"
          >Tego kurde faja bele mole jakiś krótki opis</v-row
        >
        <v-row class="flex-grow-1" align="end"
          ><v-btn>Jakiś kurde CTA</v-btn></v-row
        >
      </v-container> -->
    </v-carousel-item>

    <!-- <v-carousel-item
      src="https://www.mandarinstone.com/app/uploads/fly-images/291910/Website-Banner-1695x1121px_Outdoor-1920x1080-f50_50.jpg"
      cover
    >
      <v-container class="fill-height d-flex flex-column">
        <v-row class="flex-grow-1" align="start">Tego kurde tytuł</v-row>
        <v-row class="flex-grow-1" align="center"
          >Tego kurde faja bele mole jakiś krótki opis</v-row
        >
        <v-row class="flex-grow-1" align="end"
          ><v-btn>Jakiś kurde CTA</v-btn></v-row
        >
      </v-container>
    </v-carousel-item> -->
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
