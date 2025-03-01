<script lang="ts" setup>
const { width } = useWindowSize();
</script>

<template>
  <v-carousel hide-delimiter-background cycle show-arrows interval="5000">
    <v-carousel-item
      v-for="n in width >= 1600 ? 4 : width >= 1140 ? 3 : width >= 720 ? 2 : 1"
      :key="'skeleton-' + n"
    >
      <v-card width="340px">
        <v-skeleton-loader type="image" :width="340" :height="340" />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="text" />
      </v-card>
    </v-carousel-item>
  </v-carousel>
</template>
