<script setup lang="ts">
const props = defineProps<{
  desktop: string;
  mobile: string;
  alt: string;
  placeholder?: string;
  mobilePlaceholder?: string;
  isFirst?: boolean;
}>();

const {width} = useWindowSize({initialWidth: 390});
const isMobile = computed(() => width.value < 768);

const loading = computed(() => props.isFirst ? 'eager' : 'lazy');
const importance = computed(() => props.isFirst ? 'high' : 'low');
</script>

<template>
    <nuxt-img
    :src="isMobile ? mobile : desktop"
    :loading="loading"
    :importance="importance"
    :placeholder="isMobile && mobilePlaceholder ? mobilePlaceholder : placeholder ? placeholder : undefined"
    :alt="alt"
    format="webp"
    quality="80"
    class="w-full h-full object-cover"
    :sizes="[320, 640, 768, 1024, 1280, 2000]"
    fit="contain"
  />
</template>
