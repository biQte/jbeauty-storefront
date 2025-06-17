<script setup lang="ts">
const promoBanners = [
  {
    image: "/promocja-buildmania.webp",
    alt: "Promocja Buildmania",
    link: "/kategoria/victoria-vynn-buildmania",
  },
  {
    image: "/promocja-lakiery.webp",
    alt: "Promocja lakiery hybrydowe",
    link: "/kategoria/promocja-lakiery-hybrydowe",
  },
  {
    image: "/promocja-bazy-i-topy.webp",
    alt: "Promocja bazy i topy",
    link: "/kategoria/promocja-bazy-i-topy-hybrydowe",
  },
  {
    image: "/promocja-pielegnacja.webp",
    alt: "Promocja pielęgnacja",
    link: "/kategoria/promocja-kremy-i-oliwki-do-pielęgnacji",
  },
  {
    image: "/promocja-urzadzenia.webp",
    alt: "Promocja urządzenia",
    link: "/kategoria/promocja-narzędzia-urządzenia-i-akcesoria-victoria-vynn",
  }
];

const textPromotions: any[] = [
];
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold text-center mb-10 text-pink-600">PROMOCJE</h1>

    <nuxt-img class="w-full h-auto object-cover rounded-2xl" src="/wyprzedaz-category.webp" placeholder="/wyprzedaz-category-placeholder.webp" />
    
    <h2 class="text-sm md:text-lg lg:text-2xl bg-[#ff007a] text-black font-bold text-center mt-5 mb-5 pb-2 pt-2 pl-4 pr-4 rounded-xl">Klikaj w banery i odkrywaj promocyjne produkty</h2>

    <h3 class="text-xs md:text-sm lg:text-lg text-black text-center mb-10 mt-5"><v-icon icon="mdi-truck-check-outline" /> Darmowa dostawa paczkomatem <span class="font-bold">od 200zł</span></h3>
    <!-- Sekcja banerów -->
    <div class="grid grid-cols-1 gap-6 mb-12">
      <a
        v-for="(banner, index) in promoBanners"
        :key="index"
        :href="banner.link"
        class="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
      >
        <img
          :src="banner.image"
          :alt="banner.alt"
          class="w-full h-auto object-cover rounded-2xl"
          loading="lazy"
        />
      </a>
    </div>

    <div class="space-y-6">
      <div
        v-for="(promo, index) in textPromotions"
        :key="index"
        class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <p class="text-lg font-semibold text-gray-800">{{ promo.description }}</p>
          <p class="text-sm text-gray-500">Dotyczy: {{ promo.validFor }}</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="bg-pink-100 text-pink-700 font-mono font-bold px-3 py-1 rounded-md text-sm tracking-wider">
            {{ promo.code }}
          </span>
          <!-- <button
            @click="navigator.clipboard.writeText(promo.code)"
            class="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Skopiuj
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
