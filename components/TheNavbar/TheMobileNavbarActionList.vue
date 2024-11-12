<script setup lang="ts">
const cartStore = useCartStore();
</script>

<template>
  <div class="mobile-navbar-action-list-wrapper">
    <TheNavbarTheMobileNavbarSearchBar />
    <v-badge :content="cartStore.quantity" color="error">
      <TheNavbarTheMobileNavbarActionListItem
        icon="mdi-cart-outline"
        title="Koszyk"
      />
    </v-badge>
    <TheNavbarTheMobileNavbarActionListItem
      icon="mdi-account-outline"
      title="Konto"
    />
  </div>
</template>

<style lang="scss" scoped>
.mobile-navbar-action-list-wrapper {
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
}
</style>
