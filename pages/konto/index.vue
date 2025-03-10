<script setup lang="ts">
import { ROUTES } from "../../constants/routes";

const loading = ref<boolean>(false);

const nuxtApp = useNuxtApp();

const route = useRoute();

const sessionStore = useSessionStore();

const snackbarStore = useSnackbarStore();

const router = useRouter();

const { width, height } = useWindowSize();

const showOrders = ref<boolean>(false);

const email = ref<string>(sessionStore.session?.email!);
const firstName = ref<string>(sessionStore.session?.first_name!);
const lastName = ref<string>(sessionStore.session?.last_name!);

const config = useRuntimeConfig();

if (route.query.showOrders) {
  showOrders.value = true;
}

watch(showOrders, async (newValue) => {
  if (newValue && !ordersList.value) {
    loading.value = true;
    await loadOrders();
    loading.value = false;
  }
});

const ordersList = ref<any[]>();

const loadOrders = async () => {
  try {
    const orders = await $fetch(`/api/order`, {
      credentials: "include",
    });

    ordersList.value = orders;
  } catch (e) {
    snackbarStore.showSnackbar(
      "Wystąpił problem podczas pobierania zamówień",
      "error",
      5000
    );
  }
};

const saveAccountData = async () => {
  try {
    loading.value = true;

    if (firstName.value === "" || lastName.value === "") {
      snackbarStore.showSnackbar("Wartości nie mogą być puste", "error", 5000);
      loading.value = false;
      return;
    }

    await $fetch(`/api/customers/me`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        first_name: firstName.value,
        last_name: lastName.value,
      }),
    });

    snackbarStore.showSnackbar("Zmieniono dane konta", "success", 3000);
    loading.value = false;
    showChangeAccountDataDialog.value = false;
  } catch (e) {
    snackbarStore.showSnackbar("Wystąpił błąd", "error", 5000);
    loading.value = false;
  }
};

const showChangeAccountDataDialog = ref<boolean>(false);

loadOrders();

const logout = async () => {
  try {
    await $fetch(`/api/auth/session`, {
      credentials: "include",
      method: "DELETE",
    });

    sessionStore.deleteSession();
    router.push(ROUTES.ROOT_PAGE);
  } catch (e) {
    console.log(e);
  }
};

// onMounted(() => {
//   if (route.query.showOrders) {
//     showOrders.value = true;
//   }
// });

useSeoMeta({
  title: `JBeauty - ${showOrders.value ? "Zamówienia" : "Konto"}`,
  ogTitle: `JBeauty - ${showOrders.value ? "Zamówienia" : "Konto"}`,
});
</script>

<template>
  <v-sheet class="account-page-wrapper" :height="height * 0.7">
    <v-toolbar
      density="compact"
      class="account-page-toolbar"
      color="transparent"
    >
      <v-btn
        @click="showOrders = false"
        :active="!showOrders"
        active-color="primary"
        rounded="false"
      >
        Dane
      </v-btn>
      <v-btn
        @click="showOrders = true"
        :active="showOrders"
        active-color="primary"
        rounded="false"
      >
        Zamówienia
      </v-btn>
    </v-toolbar>
    <v-card :width="width < 720 ? width * 0.9 : width * 0.5" v-if="!showOrders">
      <v-card-title>
        Witaj, {{ sessionStore.session?.first_name }}
      </v-card-title>
      <v-card-subtitle> Tutaj znajdują się twoje dane </v-card-subtitle>
      <v-card-text>
        <p>Imię: {{ sessionStore.session?.first_name }}</p>
        <p>Nazwisko: {{ sessionStore.session?.last_name }}</p>
        <p>Adres E-mail: {{ sessionStore.session?.email }}</p>
        <br />
        <p>
          Dane lub hasło uległy zmianie?
          <v-btn
            variant="text"
            @click="showChangeAccountDataDialog = true"
            color="primary"
            >Zmień dane</v-btn
          >
        </p>
        <v-dialog :width="width * 0.5" v-model="showChangeAccountDataDialog">
          <v-card>
            <v-card-title> Zmiana danych konta </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="email"
                label="Email"
                disabled
              ></v-text-field>
              <v-text-field v-model="firstName" label="Imię"></v-text-field>
              <v-text-field v-model="lastName" label="Nazwisko"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="showChangeAccountDataDialog = false">Anuluj</v-btn>
              <v-btn @click="saveAccountData" :loading="loading" color="primary"
                >Zapisz</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <br />
        <v-btn color="primary" @click="logout">Wyloguj się</v-btn>
      </v-card-text>
    </v-card>
    <v-card :width="width < 720 ? width * 0.9 : width * 0.5" v-if="showOrders">
      <v-card-title>Twoje zamówienia</v-card-title>
      <v-card-subtitle>Tutaj możesz zobaczyć swoje zamówienia</v-card-subtitle>
      <v-card-text>
        <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
        <p v-if="!loading && !ordersList">Brak zamówień do wyświetlenia</p>
        <v-list v-if="!loading && ordersList">
          <v-list-item v-for="order in ordersList" :key="order.id">
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
  align-items: start;
  justify-content: start;
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
