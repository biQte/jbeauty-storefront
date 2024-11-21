<script setup lang="ts"></script>

<template>
  <div class="home-page-banner-wrapper">
    <div class="sending segment">
      <v-icon icon="mdi-clock-fast" />
      <p>Wysyłka w <b>24 godziny</b></p>
    </div>
    <div class="shipping segment">
      <v-icon icon="mdi-truck-check-outline" />
      <p>Darmowa dostawa <b>od 250 zł</b></p>
    </div>
    <div class="returns segment">
      <v-icon icon="mdi-calendar-check-outline" />
      <p><b>14 dni</b> na zwrot</p>
    </div>
    <div class="payments segment">
      <v-icon icon="mdi-credit-card-outline" />
      <p><b>Bezpieczne</b> płatności online</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-page-banner-wrapper {
  background-color: $secondary-color;
  // color: $primary-color;
  color: black;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 4rem 2rem;

  @media only screen and (max-width: 1280px) {
    flex-direction: column;
  }

  .segment {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
}
</style>
