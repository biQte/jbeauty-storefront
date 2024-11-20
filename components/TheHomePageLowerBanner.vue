<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<template>
  <div class="lower-banner-wrapper">
    <!-- <v-img src="@/assets/img/fotos-352.jpg" /> -->
    <!-- <v-img src="@/assets/img/fotos-363.jpg" /> -->
    <div class="left banner">
      <div class="overlay">
        <p>Nie wiem jeszcze</p>
        <v-btn :elevation="24" size="x-large" color="transparent"
          >Zobacz więcej</v-btn
        >
      </div>
    </div>
    <NuxtLink
      :to="`/produkt/pb-nails-top-do-zeli-i-hybryd-the-best-top-coat-8ml`"
      class="right banner"
    >
      <div class="overlay">
        <p>The best coat</p>
        <v-btn :elevation="24" size="x-large" color="transparent"
          >Zobacz więcej</v-btn
        >
      </div>
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.lower-banner-wrapper {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 1080px) {
    flex-direction: column;
  }

  .banner {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-position: center;
    background-size: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // padding: 15%;
    gap: 1rem;
    color: white;
    font-size: 2rem;
    text-transform: uppercase;
    aspect-ratio: 1/1;

    .overlay {
      display: flex;
      width: 100%;
      height: 100%;
      gap: 1rem;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-transform: uppercase;
      background-color: rgba(228, 48, 122, 0.1);
      color: white;
    }
  }

  .left {
    background-image: url("/public/fotos-352.jpg");
  }
  .right {
    background-image: url("/public/fotos-363.jpg");
  }
}
</style>
