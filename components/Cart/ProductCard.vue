<script setup lang="ts">
const props = defineProps<{
  item: any;
}>();

const emit = defineEmits<{
  (e: 'increase', id: string): void;
  (e: 'decrease', id: string): void;
  (e: 'remove', id: string): void;
}>();

const increase = () => emit('increase', props.item.id);
const decrease = () => emit('decrease', props.item.id);
const remove = () => emit('remove', props.item.id);
</script>

<template>
  <div class="flex gap-4 items-start border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm">
    <!-- Zdjęcie -->
    <img
      :src="item.thumbnail || '/placeholder.webp'"
      alt="product image"
      class="w-24 h-24 object-contain rounded-md bg-white border dark:border-gray-700"
    />

    <div class="flex flex-col flex-1">
      <!-- Nazwa produktu -->
      <div class="font-semibold text-sm md:text-base">{{ item.title }}</div>

      <!-- Cena -->
      <div class="text-sm text-gray-500 mt-1">
        <span :class="{strike: item.compare_at_unit_price}">{{ new Intl.NumberFormat('pl-PL', { style: "currency", currency: 'pln' }).format(item.compare_at_unit_price
                          ? item.compare_at_unit_price
                          : item.unit_price) }}</span><span v-if="item.compare_at_unit_price" class="sale-price">&nbsp;{{ new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'pln' }).format(item.unit_price) }}</span> x {{ item.quantity }}
      </div>

      <!-- Ilość -->
      <div class="flex items-center gap-2 mt-2">
        <button
          class="w-7 h-7 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="decrease"
        >
          -
        </button>
        <div class="w-8 text-center">{{ item.quantity }}</div>
        <button
          class="w-7 h-7 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="increase"
        >
          +
        </button>
      </div>

      <!-- Usuń -->
      <button
        class="mt-2 text-sm text-[#ff5c8a] hover:underline self-start"
        @click="remove"
      >
        Usuń
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.strike {
  text-decoration: line-through;
}

.sale-price {
//   font-size: 1.2rem;
  color: $primary-color;
}
</style>
