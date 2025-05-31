<script setup lang="ts">
const { width = 390, height = 500 } = useWindowSize();

const orders = ref<any[]>([]);
const loading = ref<boolean>(false);

const {data: ordersList} = await useFetch('/api/order', {
  credentials: 'include',
});

orders.value = ordersList.value;

useSeoMeta({
    title: 'JBeauty - Twoje zamówienia',
    ogTitle: 'JBeauty - Twoje zamówienia',
})
</script>

<template>
    <v-sheet class="account-page-wrapper" :min-height="height * 0.7">
        <AccountLinks />
        <v-card :width="width < 720 ? width * 0.9 : width * 0.5" v-if="!loading">
      <v-card-title>Twoje zamówienia</v-card-title>
      <v-card-subtitle>Tutaj możesz zobaczyć swoje zamówienia</v-card-subtitle>
      <v-card-text>
        <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
        <p v-if="!loading && !orders">Brak zamówień do wyświetlenia</p>
        <v-list v-if="!loading && orders">
          <v-list-item v-for="order in orders" :key="order.id">
            <v-list-item-title
              >Zamówienie numer: {{ order.display_id }}</v-list-item-title
            >
            <v-list-item-subtitle
              >Złożone dnia: {{ new Date(order.created_at).getDate() }}/{{
                new Date(order.created_at).getMonth()
              }}/{{ new Date(order.created_at).getFullYear() }}
            </v-list-item-subtitle>
            <br />
            <p>
              Kwota:
              {{
                new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                }).format(order.total)
              }}
            </p>
            <br />
            <v-list-item-action>
              <v-btn
                color="primary"
                :to="`/potwierdzenie-zamowienia/${order.id}`"
                >Zobacz zamówienie</v-btn
              >
            </v-list-item-action>
            <br />
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    </v-sheet>
</template>

<style lang="scss" scoped>
.account-page-wrapper {
  // padding: 0 15%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  height: 100%;
  width: 100%;

  @media only screen and (max-width: 720px) {
    flex-direction: column;
    margin: auto;
    align-items: center;
    justify-content: start;
    padding: 0;
  }
}
</style>
