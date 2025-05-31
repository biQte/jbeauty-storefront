<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  isTotal?: boolean;
  isDiscount?: boolean;
}>();
</script>

<template>
  <div
    class="flex justify-between items-center py-1"
    :class="{
      'font-semibold text-base': isTotal,
      'text-green-600': isDiscount,
      'text-sm text-gray-800': !isTotal && !isDiscount
    }"
  >
    <span>{{ label }}</span>
    <span>{{ value }}</span>
  </div>
</template>
