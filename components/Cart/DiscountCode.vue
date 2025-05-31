<script setup lang="ts">
const modelValue = defineModel<string>({ required: true });

const emit = defineEmits<{
  (e: 'apply'): void;
}>();

const onSubmit = (e: Event) => {
  e.preventDefault();
  emit('apply');
};
</script>

<template>
  <form @submit="onSubmit" class="space-y-2">
    <label for="discount" class="block text-sm font-medium text-gray-700">
      Kod rabatowy
    </label>

    <div class="flex gap-2">
      <input
        id="discount"
        v-model="modelValue"
        type="text"
        class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm bg-white  text-gray-900"
        placeholder="Wpisz kod rabatowy"
      />
      <button
        type="submit"
        class="bg-[#ff5c8a] text-white px-4 py-2 rounded hover:opacity-90 transition"
      >
        Zastosuj
      </button>
    </div>
  </form>
</template>
