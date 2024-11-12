<script setup lang="ts">
const cartStore = useCartStore();
</script>

<template>
  <div class="navbar-action-list-wrapper">
    <v-badge :content="cartStore.quantity" color="error"
      ><TheNavbarActionListItem icon="mdi-cart-outline" title="Koszyk"
    /></v-badge>
    <TheNavbarActionListItem icon="mdi-account-outline" title="Konto" />
  </div>
</template>

<style lang="scss" scoped>
.navbar-action-list-wrapper {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
</style>
