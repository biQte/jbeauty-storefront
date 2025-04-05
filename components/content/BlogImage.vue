<script setup lang="ts">
defineProps({
  src: String,
  alt: String,
  align: String,
  height: {
    type: Number,
    required: false,
  },
});
</script>

<template>
  <div class="blog-image-container" :class="align">
    <v-img
      min-height="100"
      :height="height ? height : ''"
      :src="src"
      :alt="alt"
      contain
      class="blog-image"
    />
  </div>
</template>

<style lang="scss" scoped>
.blog-image-container {
  margin: 1rem 0 !important;

  .blog-image {
    min-height: 100px !important;
    min-width: 200px !important;
  }
}

.blog-image-container.left {
  float: left !important;
  margin-right: 1rem !important;
  width: 50% !important;

  @media only screen and (max-width: 720px) {
    width: 100% !important;
    text-align: center !important;
    margin: 0 !important;
  }
}

.blog-image-container.right {
  float: right !important;
  margin-left: 1rem !important;
  width: 50% !important;
  width: auto !important;
  @media only screen and (max-width: 720px) {
    width: 100% !important;
    text-align: center !important;
    margin: 0 !important;
  }
}

.blog-image-container.center {
  clear: both !important;
  width: 100% !important;
  text-align: center !important;
}
</style>
