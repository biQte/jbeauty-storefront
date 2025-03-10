<script setup lang="ts">
useSeoMeta({
  title: "JBeauty - Nie pamiętam hasła",
  ogTitle: "JBeauty - Nie pamiętam hasła",
});

const { width } = useWindowSize();

const snackarStore = useSnackbarStore();
const config = useRuntimeConfig();

const email = ref<string | null>(null);

const sendResetPasswordToken = async () => {
  try {
    if (!email.value) {
      snackarStore.showSnackbar("Należy podać adres E-mail", "error", 5000);
      return;
    }

    $fetch(`/api/auth/customer/emailpass/reset-password`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        identifier: email.value,
      }),
    })
      .then(() => {
        email.value = null;
        snackarStore.showSnackbar(
          "Na podany adres E-mail została wysłana wiadomość z instrukcją do resetowania hasła",
          "success",
          5000
        );
      })
      .catch((e) => {
        throw e;
      });
  } catch (e: any) {
    snackarStore.showSnackbar(e.toString(), "error", 5000);
  }
};
</script>

<template>
  <v-card :width="width < 720 ? width * 0.8 : 500">
    <template v-slot:title> Resetowanie hasła </template>
    <template v-slot:subtitle>
      Podaj adres E-mail do konta dla którego nie pamiętasz hasła.
    </template>
    <template v-slot:text>
      <v-text-field label="Adres E-mail" v-model="email"></v-text-field>
      <v-btn @click="sendResetPasswordToken" color="primary"
        >Resetuj hasło</v-btn
      >
    </template>
  </v-card>
</template>

<style lang="scss" scoped></style>
