<script setup lang="ts">
const cartStore = useCartStore();
const sessionStore = useSessionStore();
const snackbarStore = useSnackbarStore();

const loyaltyPoints = ref<number | null>(null);
const showTooltip = ref(false);
const tooltipRef = ref(null);

const getLoyaltyPoints = async () => {
  const { data, error } = await useFetch('/api/customers/me/loyalty-points', {
    method: 'GET',
    credentials: 'include',
    server: false,
  });

  if (error.value) {
    loyaltyPoints.value = null;
    if(!sessionStore.isAuthenticated){
        return;
    }
    snackbarStore.showSnackbar(
      'Nie udało się pobrać punktów lojalnościowych',
      'error',
      5000
    );
    return;
  }

  if (data.value) {
    // @ts-expect-error
    loyaltyPoints.value = data.value.points;
  } else {
    loyaltyPoints.value = null;
  }
};

const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value;
};

const isLoyaltyPromoApplied = computed(() => {
  // @ts-expect-error
  return cartStore.cartObject?.promotions?.some(
    (promo: any) => promo.id === cartStore.cartObject?.metadata?.loyalty_promo_id
  );
});

onClickOutside(tooltipRef, () => {
  showTooltip.value = false;
});

const handleTogglePromotion = async () => {
  if (!isLoyaltyPromoApplied.value) {
    try {
      await cartStore.applyLoyaltyPoints();
    } catch (e) {
      console.error(e);
    }
  } else {
    await cartStore.removeLoyaltyPoints();
  }
};

onMounted(async () => {
  await nextTick();
  await getLoyaltyPoints();
});
</script>

<template>
  <div class="text-sm text-gray-800 space-y-2">
    <template v-if="!sessionStore.isAuthenticated">
      <NuxtLink
        to="/login?redirect=/koszyk"
        class="text-sm text-pink-600 hover:underline"
      >
        Zaloguj się, aby zbierać punkty lojalnościowe
      </NuxtLink>
    </template>

    <template v-else-if="loyaltyPoints !== null">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 relative" ref="tooltipRef">
          <span>Masz <strong>{{ loyaltyPoints }}</strong> pkt</span>

          <!-- Ikonka pytajnika -->
          <button
            @click="toggleTooltip"
            class="w-5 h-5 rounded-full bg-gray-300 text-white text-xs flex items-center justify-center hover:bg-gray-400 focus:outline-none"
            aria-label="Informacja o punktach"
          >
            ?
          </button>

          <!-- Tooltip -->
          <div
            v-show="showTooltip"
            class="absolute top-full mt-2 left-0 z-10 w-64 text-sm bg-white text-gray-800 border border-gray-300 rounded-lg shadow-lg p-3"
          >
            Punkty mogą pokryć maksymalnie 50% wartości produktów.
            <br />
            <NuxtLink
              to="/regulamin#loyalty"
              class="text-pink-600 underline hover:text-pink-500"
            >
              Zobacz regulamin
            </NuxtLink>
          </div>
        </div>

        <VBtn
          color="secondary"
          size="small"
          @click="handleTogglePromotion"
          v-if="loyaltyPoints > 0"
        >
          {{ isLoyaltyPromoApplied ? 'Usuń' : 'Wykorzystaj' }}
        </VBtn>
      </div>
    </template>
  </div>
</template>
