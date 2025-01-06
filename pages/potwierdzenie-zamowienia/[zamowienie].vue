<script setup lang="ts">
import type { OrderDTO, StoreOrder } from "@medusajs/types";
import { useWindowSize } from "@vueuse/core";

useSeoMeta({
  title: "JBeauty - Potwierdzenie zamówienia",
  ogTitle: "JBeuaty - Potwierdzenie zamówienia",
});

const route = useRoute();

const nuxtApp = useNuxtApp();
const medusaClient = nuxtApp.$medusaClient;
const config = useRuntimeConfig();

const orderId = ref<string>(route.params.zamowienie as string);
const { width, height } = useWindowSize();
const order = ref<StoreOrder>();
onMounted(async () => {
  const orderResponse = await medusaClient.store.order.retrieve(orderId.value);
  // const queryParams = encodeURIComponent("+fulfillments.labels");

  // const orderResponse = await $fetch(
  //   `${config.public.medusaUrl}/store/orders/${orderId.value}?fields=${queryParams}`,
  //   {
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-publishable-api-key": config.public.medusaPublishableKey,
  //     },
  //   }
  // );

  order.value = orderResponse.order as StoreOrder;
  console.log(order.value);
});
</script>

<template>
  <div class="order-confirmation-wrapper">
    <h1>Dziękujemy!</h1>
    <h1>
      Twoje zamówienie zostało złożone i otrzymało numer:
      {{ order?.display_id }}
    </h1>
    <h2>Podsumowanie</h2>
    <div class="order-items">
      <v-table :max-width="width * 0.8" class="order-items-table">
        <thead v-if="width > 720">
          <tr>
            <td>Produkt</td>
            <td>Cena</td>
            <td>Ilość</td>
            <td>Razem</td>
          </tr>
        </thead>
        <tbody v-if="width > 720">
          <tr v-for="item in order?.items" :key="item.id">
            <th>
              <NuxtLink
                class="product-wrapper"
                :to="`/produkt/${item.product_handle}`"
              >
                <v-img
                  class="product-cover-image"
                  cover
                  :src="item.thumbnail!"
                ></v-img>
                {{ item.product_title }}
              </NuxtLink>
            </th>
            <th>
              {{
                new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                }).format(item.unit_price)
              }}
            </th>
            <th>x{{ item.quantity }}</th>
            <th>
              {{
                new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                }).format(item.unit_price * item.quantity)
              }}
            </th>
          </tr>
        </tbody>
        <thead v-if="width <= 720">
          <tr>
            <td>Produkt</td>
            <td>Ilość</td>
          </tr>
        </thead>
        <tbody v-if="width <= 720">
          <tr v-for="item in order?.items" :key="item.id">
            <th>
              <br />
              <NuxtLink :to="`/produkt/${item.product_handle}`">
                <v-img :src="item.thumbnail!" cover></v-img>
                <p>{{ item.product_title }}</p>
              </NuxtLink>
              <br />
              <p>
                Cena:
                {{
                  new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(item.unit_price)
                }}
              </p>
              <p>
                Łącznie:
                {{
                  new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(item.unit_price * item.quantity)
                }}
              </p>
              <br />
            </th>
            <th>x{{ item.quantity }}</th>
          </tr>
        </tbody>
        <thead>
          <tr>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr v-if="order?.discount_total">
            <td>Rabaty</td>
            <td>
              -{{
                new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                }).format(order.discount_total)
              }}
            </td>
          </tr>
          <tr>
            <td>Suma produktów</td>
            <td>
              {{
                new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                }).format(order?.item_total!)
              }}
            </td>
          </tr>
          <tr>
            <td>Dostawa</td>
            <td>
              {{
                new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                }).format(order?.shipping_total!)
              }}
            </td>
          </tr>
          <!-- <tr>
            <td>W tym podatek VAT(23%)</td>
            <td>
              {{
                new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                }).format(order?.tax_total!)
              }}
            </td>
          </tr> -->
        </tbody>
        <thead>
          <tr>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Suma</td>
            <td>
              {{
                new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                }).format(order?.total!)
              }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <h2>Dostawa</h2>
    <div class="v-list-row">
      <v-list>
        <v-list-item>
          <template v-slot:title><b>Dane odbiorcy</b></template>
        </v-list-item>
        <v-list-item>
          {{ order?.shipping_address?.first_name }}
          {{ order?.shipping_address?.last_name }}
        </v-list-item>
        <v-list-item>
          {{ order?.shipping_address?.address_1 }}
          <span v-if="order?.shipping_address?.address_2"
            >, {{ order.shipping_address.address_2 }}</span
          >
        </v-list-item>
        <v-list-item>
          {{ order?.shipping_address?.postal_code }},
          {{ order?.shipping_address?.city }}
        </v-list-item>
        <v-list-item
          v-if="order?.shipping_address?.metadata?.wantsInvoice as boolean && !order?.shipping_address?.metadata?.differentThanShipping as boolean"
        >
          {{ order?.shipping_address?.company }}
          {{ order?.shipping_address?.metadata?.vatNumber }}
        </v-list-item>
      </v-list>
      <v-list
        v-if="order?.shipping_address?.metadata?.wantsInvoice as boolean && order?.shipping_address?.metadata?.differentThanShipping as boolean"
      >
        <v-list-item>
          <template v-slot:title><b>Dane do faktury</b></template>
        </v-list-item>
        <!-- <v-list-item>
          {{ order?.billing_address?.first_name }}
          {{ order?.billing_address?.last_name }}
        </v-list-item> -->
        <v-list-item>
          {{ order?.billing_address?.address_1 }}
          <span v-if="order?.billing_address?.address_2"
            >, {{ order?.billing_address?.address_2 }}</span
          >
        </v-list-item>
        <v-list-item>
          {{ order?.billing_address?.postal_code }},
          {{ order?.billing_address?.city }}
        </v-list-item>
        <v-list-item>
          {{ order?.billing_address?.metadata?.vatNumber }},
          {{ order?.billing_address?.company }}
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item>
          <template v-slot:title><b>Dane kontaktowe</b></template>
        </v-list-item>
        <v-list-item>
          {{ order?.shipping_address?.phone }}
        </v-list-item>
        <v-list-item>
          {{ order?.email ? order.email : order?.customer?.email }}
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item>
          <template v-slot:title><b>Metoda dostawy</b></template>
        </v-list-item>
        <v-list-item>
          {{ order?.shipping_methods?.[0].name }} ({{
            new Intl.NumberFormat("pl-PL", {
              style: "currency",
              currency: "PLN",
            }).format(order?.shipping_methods?.[0].amount!)
          }})
        </v-list-item>
      </v-list>
    </div>
    <h2>Status</h2>
    <v-list>
      <v-list-item
        ><b>Płatność</b>:
        {{
          order?.payment_status === "captured" ? "Opłacone" : "Nieopłacone"
        }}</v-list-item
      >
      <v-list-item>
        <b>Dostawa</b>:
        {{
          order?.fulfillment_status === "fulfilled"
            ? "Zamówienie spakowane, czeka na odbiór kuriera"
            : order?.fulfillment_status === "shipped"
            ? "Zamówienie wysłane"
            : order?.fulfillment_status === "delivered"
            ? "Zamówienie doręczone"
            : "Zamówienie przyjęte do realizacji"
        }}
      </v-list-item>
      <!-- <v-list-row v-if="order?.fulfillment_status === 'shipped'"
        >Link do śledzenia przesyłki:
        <a
          :href="`https://inpost.pl/sledzenie-przesylek?number=${order?.fulfillments?.[0].labels[0].}`"
        ></a
      ></v-list-row> -->
    </v-list>
    <!-- <h2>Płatność</h2>
    <div class="v-list-row">
      <v-list>
        <v-list-item>
          <template v-slot:title>Metoda płatności</template>
          </v-list-item>
          <v-list-item>
            {{ order?.payment_collections?.[0] }}
          </v-list-item>
      </v-list>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.order-confirmation-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  h1 {
    text-align: start;
    padding-left: 15%;
    width: 100%;
    font-size: 2.5rem;

    @media only screen and (max-width: 720px) {
      padding-left: 0;
      font-size: 2rem;
      text-align: center;
    }
  }
  h2 {
    padding-left: 15%;
    text-align: start;
    width: 100%;
    font-size: 2rem;

    @media only screen and (max-width: 720px) {
      font-size: 1.8rem;
      padding-left: 0;
      text-align: center;
    }
  }
  .order-items {
    .order-items-table {
      // width: clamp(500px, 900px, 1080px);
      .product-wrapper {
        display: flex;
        align-items: start;
        justify-content: center;
        padding: 1rem;
        gap: 0.5rem;
        .product-cover-image {
          width: clamp(80px, 100px, 105px);
          height: clamp(80px, 100px, 105px);
        }
      }
    }
  }

  .v-list-row {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
    align-items: start;
    @media only screen and (max-width: 720px) {
      flex-direction: column;
    }
  }
}
</style>
