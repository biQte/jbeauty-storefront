<script setup lang="ts">
useSeoMeta({
  title: "JBeauty - Kody rabatowe",
  ogTitle: "JBeauty - Kody rabatowe",
  description:
    "Wyjątkowe rabaty na wyciągnięcie ręki! Sprawdź aktualne kody rabatowe w JBeauty i spełnij swoje paznokciowe marzenia w niższej cenie. Poczuj się jak królowa oszczędności i zaopatrz się w ulubione lakiery, bazy, topy oraz akcesoria. Piękne paznokcie nigdy nie były tak dostępne!",
  ogDescription:
    "Wyjątkowe rabaty na wyciągnięcie ręki! Sprawdź aktualne kody rabatowe w JBeauty i spełnij swoje paznokciowe marzenia w niższej cenie. Poczuj się jak królowa oszczędności i zaopatrz się w ulubione lakiery, bazy, topy oraz akcesoria. Piękne paznokcie nigdy nie były tak dostępne!",
});
</script>

<template>
  <div class="discount-codes-wrapper">
    <h1>Kody rabatowe</h1>
    <p>
      Z kodem rabatowym START10, otrzymasz 10% zniżki na wszystkie produkty z
      okazji otwarcia sklepu.
    </p>
    <p class="expires">Obowiązuje od 22.11.2024r. do 22.12.2024r.</p>
  </div>
</template>

<style lang="scss" scoped>
.discount-codes-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  //   justify-content: start;
  width: 100%;
  height: 100%;
  gap: 1rem;
}

h1 {
  font-size: 4rem;
  text-transform: uppercase;
  color: $primary-color;
  @media only screen and (max-width: 720px) {
    font-size: 2rem;
  }
}

p {
  font-size: 3rem;
  text-align: center;
  @media only screen and (max-width: 720px) {
    font-size: 1.2rem;
  }
}

.expires {
  font-size: 2rem;
  @media only screen and (max-width: 720px) {
    font-size: 1rem;
  }
}
</style>
