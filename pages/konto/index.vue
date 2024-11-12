<script setup lang="ts">
import { ROUTES } from "../../constants/routes";

const nuxtApp = useNuxtApp();

const sessionStore = useSessionStore();

const medusaClient = nuxtApp.$medusaClient;

const router = useRouter();

const { width, height } = useWindowSize();

const showOrders = ref<boolean>(false);

const logout = async () => {
  try {
    await medusaClient.auth.logout();
    sessionStore.deleteSession();
    router.push(ROUTES.ROOT_PAGE);
  } catch (e) {
    console.log(e);
  }
};
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
          <v-btn variant="text" color="primary">Zmień dane</v-btn>
        </p>
        <br />
        <v-btn color="primary" @click="logout">Wyloguj się</v-btn>
      </v-card-text>
    </v-card>
    <v-card :width="width < 720 ? width * 0.9 : width * 0.5" v-if="showOrders">
      <v-card-title>Twoje zamówienia</v-card-title>
      <v-card-subtitle>Tutaj możesz zobaczyć swoje zamówienia</v-card-subtitle>
      <v-card-text>
        Lista zamówień będzie Tutaj
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
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
