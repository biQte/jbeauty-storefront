<script setup lang="ts">
const snackbarStore = useSnackbarStore();
</script>

<template>
  <v-snackbar
    v-model="snackbarStore.show"
    :color="snackbarStore.color"
    :timeout="snackbarStore.timeout"
    top
  >
    {{ snackbarStore.message }}
  </v-snackbar>
</template>

<style lang="scss" scoped></style>
