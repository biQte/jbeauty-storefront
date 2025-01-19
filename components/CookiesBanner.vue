<script setup lang="ts">
const emit = defineEmits(["acceptedCookies"]);

// Tworzymy ciasteczko `cookiesAccepted`
// const cookiesAccepted = useCookie("cookiesAccepted", {
//   default: () => false,
// });

// Funkcja akceptująca ciasteczka
const acceptCookies = () => {
  // cookiesAccepted.value = true; // Ustawiamy wartość ciasteczka
  emit("acceptedCookies"); // Emitujemy zdarzenie do rodzica
};
</script>

<template>
  <v-sheet
    border="md"
    class="pa-6"
    max-width="400"
    elevation="2"
    style="position: fixed; bottom: 16px; right: 16px; z-index: 1000"
  >
    <h4 class="text-h5 font-weight-bold mb-4">Pliki cookies</h4>
    <p>
      Nasza strona korzysta z plików cookies w celu zapewnienia funkcjonalności.
      Kontynuacja korzystanie z naszej strony, oświadcza przeczytanie i
      akceptację polityki prywatności.
    </p>
    <br />
    <v-btn color="primary" size="large" rounded="false" @click="acceptCookies"
      >Rozumiem</v-btn
    >
  </v-sheet>
</template>

<style lang="scss" scoped></style>
