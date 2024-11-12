<script setup lang="ts">
const dialog = ref<boolean>(false);
</script>

<template>
  <v-dialog
    close-on-content-click
    v-model="dialog"
    transition="dialog-bottom-transition"
    fullscreen
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn variant="text" icon="mdi-magnify" v-bind="activatorProps"></v-btn>
    </template>
    <v-card>
      <v-toolbar>
        <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
        <v-toolbar-title>Szukaj</v-toolbar-title>
      </v-toolbar>
      <TheNavbarSearchBar @close-dialog="dialog = false" />
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped></style>
