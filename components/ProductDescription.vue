<script setup lang="ts">
const { description } = defineProps({
  description: String,
});
</script>

<template>
  <div v-html="description"></div>
</template>

<style lang="scss" scoped>
::v-deep(ul) {
  list-style-type: disc !important;
  padding-left: 20px;
}
</style>
