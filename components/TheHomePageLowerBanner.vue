<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<template>
  <div class="lower-banner-wrapper">
    <!-- <v-img src="@/assets/img/fotos-352.jpg" /> -->
    <!-- <v-img src="@/assets/img/fotos-363.jpg" /> -->
    <!-- <NuxtLink class="left banner" :to="`/kategoria/swiateczne-perelki`"> -->
    <NuxtLink
      class="left banner"
      :to="`/produkt/victoria-vynn-mini-lampa-led-6w-usb`"
    >
      <div class="overlay">
        <!-- <p>Świąteczne perełki</p> -->
        <!-- <p>Mini lampa LED</p> -->
        <v-btn :elevation="24" size="x-large" color="transparent"
          >Zobacz więcej</v-btn
        >
      </div>
    </NuxtLink>
    <NuxtLink
      :to="`/kategoria/victoria-vynn-senso-nail-care-oil`"
      class="right banner"
    >
      <div class="overlay">
        <!-- <p>Quick Trick Nail Forms</p> -->
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
    background-size: cover;
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
      background-color: rgba(0, 0, 0, 0.2);
      color: white;
    }
  }

  .left {
    // background-image: url("/public/product_gallery_3f99f2894a.jpg");
    // background-image: url("/public/VV_PinkProsecco_1200x1200_PLE-dystry.jpg");
    // background-image: url("/public/VYNN_VV_BRILLANT_1200_PLE.webp");
    background-image: url("/public/minilamp.webp");
    background-size: cover;
  }
  .right {
    // background-image: url("/public/fotos-363.webp");
    background-image: url("/public/sensooil.webp");
  }
}
</style>
