<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});

console.log(props.error?.message);

const pageNotFound = props.error?.statusCode === 404;
</script>

<template>
  <NuxtLayout name="default">
    <div class="error-page-wrapper">
      <v-sheet v-if="pageNotFound">
        <div class="inner-wrapper">
          <h1>404</h1>
          <p>Strona której szukasz nie została znaleziona</p>
          <v-btn color="primary" to="/">Wróc na stronę główną</v-btn>
        </div>
      </v-sheet>
      <v-sheet v-else>
        <div class="inner-wrapper">
          <h1>500</h1>
          <p>
            Wystąpił nieoczekiwany błąd. Wróc na stronę główną lub spróbuj
            ponownie później.
          </p>
          <v-btn color="primary" to="/">Wróć na stronę główną</v-btn>
        </div>
      </v-sheet>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.error-page-wrapper {
  margin-top: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: clamp(50vh, 60vh, 80vh);
  .inner-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
}

h1 {
  font-size: 3rem;
}

p {
  font-size: 2rem;
}
</style>
