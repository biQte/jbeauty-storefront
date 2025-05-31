<script setup lang="ts">
const props = defineProps<{
  promotions?: any[];
  total?: number;
  itemTotal?: number;
  discountTotal?: number;
  shippingAmount?: number;
  missingAmount?: number;
  canCheckout: boolean;
}>();

const emit = defineEmits<{
  (e: 'proceed'): void;
  (e: 'remove-discount', code: string): void;
}>();

const progressBarWidth = computed(() => {
  const total = props.itemTotal ?? 0;
  return Math.min(100, Math.round((total / 200) * 100));
});

const formatPrice = (amount?: number) =>
  amount != null ? `${new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'pln' }).format(amount)}` : '—';
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
    <h2 class="text-lg font-semibold mb-2">Podsumowanie</h2>

    <CartTotalLine label="Wartość produktów" :value="formatPrice(itemTotal)" />
    <CartTotalLine
      v-if="discountTotal"
      label="Rabat"
      :value="'- ' + formatPrice(discountTotal)"
      class="text-green-600"
    />
    <CartTotalLine
      label="Dostawa"
      :value="shippingAmount ? formatPrice(shippingAmount) : 'W następnym kroku'"
    />

    <CartTotalLine
      label="Do zapłaty"
      :value="formatPrice(itemTotal)"
      class="font-bold text-lg mt-4"
    />

    <!-- Kody rabatowe -->
    <div v-if="promotions?.length" class="mt-4 space-y-2">
      <div v-for="promo in promotions" :key="promo.code" class="flex items-center justify-between text-sm">
        <span class="text-gray-700">{{ promo.code }}</span>
        <button
          class="text-[#ff5c8a] hover:underline"
          @click="emit('remove-discount', promo.code)"
        >
          Usuń
        </button>
      </div>
    </div>

    <!-- Slot na CartDiscountCode -->
    <div class="mt-4">
      <slot />
    </div>

    <div
        v-if="missingAmount && missingAmount > 0"
        class="bg-pink-50 border border-pink-200 text-sm rounded-md p-4 mt-4"
        >
        <div class="flex items-center gap-2 mb-2">
            <span class="text-pink-600 font-medium">
            Brakuje {{ new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'pln' }).format(missingAmount) }} do darmowej dostawy paczkomatem
            </span>
        </div>

       <div class="relative w-full mb-3">
            <div class="h-2 rounded bg-pink-100 overflow-hidden">
                <div
                class="h-full bg-[#ff5c8a] transition-all duration-300"
                :style="{ width: `${progressBarWidth}%` }"
                ></div>
            </div>

            <div
                class="absolute -top-2 text-lg z-10 transition-all duration-300"
                :style="{ left: `${progressBarWidth}%`, transform: 'translateX(-50%)' }"
                style="user-select: none;"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-6" version="1.0" width="1024.000000pt" height="1024.000000pt" viewBox="0 0 1024.000000 1024.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                        <path d="M977 8176 c-62 -17 -116 -61 -147 -122 l-25 -48 0 -2281 0 -2280 24 -45 c32 -61 76 -107 136 -138 50 -27 51 -27 308 -30 l257 -3 0 29 c0 49 47 215 88 309 175 407 562 663 1002 663 291 0 573 -113 771 -310 159 -158 274 -381 312 -606 l13 -79 1344 0 1344 0 12 70 c70 412 345 738 736 871 286 97 640 61 894 -92 204 -123 351 -290 449 -512 37 -85 72 -209 82 -290 l6 -53 276 3 c260 3 278 4 316 25 54 29 110 87 137 142 l23 46 0 845 0 845 -29 58 c-35 69 -123 161 -254 264 -418 331 -395 310 -560 513 -69 85 -153 189 -187 230 -82 100 -237 291 -252 310 -6 8 -36 44 -66 80 -29 36 -105 128 -167 205 -196 244 -251 291 -400 349 -54 20 -72 21 -702 24 l-648 3 0 412 0 413 -26 52 c-14 29 -42 66 -62 82 -78 64 100 60 -2546 59 -1933 0 -2420 -3 -2459 -13z m6249 -1629 c12 -7 86 -93 165 -192 78 -99 192 -243 254 -320 61 -77 151 -192 200 -255 50 -63 95 -122 102 -130 83 -104 91 -122 76 -173 -5 -18 -23 -41 -42 -54 l-34 -23 -681 0 c-761 0 -729 -3 -768 70 -17 32 -18 69 -18 518 0 412 2 487 15 512 30 58 39 59 390 59 233 0 326 -3 341 -12z"/>
                        <path d="M2440 3767 c-222 -66 -378 -212 -455 -427 -37 -101 -45 -253 -21 -364 56 -248 258 -449 504 -501 161 -33 321 -13 468 59 75 38 103 59 170 128 129 136 187 282 186 468 -3 222 -114 428 -300 553 -146 99 -381 134 -552 84z"/>
                        <path d="M7330 3772 c-227 -64 -389 -214 -466 -432 -35 -100 -44 -262 -20 -365 45 -191 180 -363 347 -443 116 -56 214 -76 342 -70 180 9 326 75 449 206 269 285 228 760 -87 992 -118 87 -219 121 -380 126 -95 3 -134 0 -185 -14z"/>
                    </g>
                </svg>

            </div>
        </div>

        <NuxtLink
            to="/kategoria/produkty"
            class="text-pink-600 font-semibold text-sm hover:underline"
        >
            Dobierz produkty
        </NuxtLink>
    </div>

    <!-- Przycisk do zamówienia -->
    <button
      class="w-full mt-4 py-2 px-4 bg-[#ff5c8a] text-white rounded hover:opacity-90 transition disabled:opacity-50"
      :disabled="!canCheckout"
      @click="emit('proceed')"
    >
      Przejdź do zamówienia
    </button>
  </div>
</template>
