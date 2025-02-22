<script setup lang="ts">
defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "Obrazek",
  },
});
</script>

<template>
  <div class="blog-image-container left">
    <v-img :src="src" :alt="alt" cover class="blog-image" />
  </div>
</template>

<style scoped>
.blog-image-container {
  margin: 1rem 0;
}

.blog-image-container.left {
  float: left;
  margin-right: 1rem;
}

.blog-image-container.right {
  float: right;
  margin-left: 1rem;
}

.blog-image-container.center {
  text-align: center;
}
</style>
