<script setup lang="ts">
defineProps({
  src: String,
  align: String,
  title: String,
});
</script>

<template>
  <div class="blog-video-container" :class="align">
    <!-- width="560"
      height="315" -->
    <iframe
      :src="src"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
    <!-- referrerpolicy="strict-origin-when-cross-origin" -->
  </div>
</template>

<style lang="scss" scoped>
.blog-video-container {
  margin: 1rem 0;
  position: relative;
  width: 100%;
  max-width: 560px; /* Maksymalna szerokość */
  aspect-ratio: 16 / 9; /* Proporcje 16:9 */
}

.blog-video-container.left {
  float: left;
  margin-right: 1rem;
  @media only screen and (max-width: 720px) {
    width: 100%;
    text-align: center;
    margin: 0;
  }
}

.blog-video-container.right {
  float: right;
  margin-right: 1rem;
  @media only screen and (max-width: 720px) {
    width: 100%;
    text-align: center;
    margin: 0;
  }
}

.blog-video-container.center {
  clear: both;
  text-align: center;
}

iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>

<!-- https://www.youtube.com/embed/SlyzkarfHpg?si=JlK4VKDyjAVMB9cW -->
<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/SlyzkarfHpg?si=JlK4VKDyjAVMB9cW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> -->
