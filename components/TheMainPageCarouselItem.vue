<script setup lang="ts">
const props = defineProps<{
  desktop: string;
  mobile: string;
  alt: string;
  placeholder?: string;
  mobilePlaceholder?: string;
  isFirst?: boolean;
}>();

const { width } = useWindowSize({ initialWidth: 390 });
const isMobile = computed(() => width.value < 768);

const loading = ref(true);
const onLoad = () => {
  setTimeout(() => {
    loading.value = false;
  }, 3000);
};

const src = computed(() => isMobile.value ? props.mobile : props.desktop);
const placeholderSrc = computed(() =>
  isMobile.value && props.mobilePlaceholder
    ? props.mobilePlaceholder
    : props.placeholder
);

const importance = computed(() => props.isFirst ? 'high' : 'low');
</script>

<template>
  <div
    class="w-full"
    :class="isMobile ? 'h-[96%]' : 'h-full'"
  >
    <img
      v-if="loading && placeholderSrc"
      :src="placeholderSrc"
      :alt="alt"
      class="w-full object-contain absolute top-0 left-0"
      :class="[isMobile ? 'h-[96%]' : 'h-full']"
    />
    <img
      :src="src"
      loading="lazy"
      @load="onLoad"
      :importance="importance"
      :alt="alt"
      class="w-full object-contain transition-opacity duration-700 z-10"
      :class="[isMobile ? 'h-[96%]' : 'h-full', loading ? 'opacity-0' : 'opacity-100']"
      fit="contain"
    />
  </div>
</template>
