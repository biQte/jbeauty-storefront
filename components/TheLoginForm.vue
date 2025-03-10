<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import { object as yupObject, string as yupString, type InferType } from "yup";
import { ROUTES } from "../constants/routes";
import { handleFetchError } from "~/utils/handleFetchError";
import type { CustomerDTO } from "@medusajs/types";
import { useWindowSize } from "@vueuse/core";

const config = useRuntimeConfig();

const router = useRouter();

const sessionStore = useSessionStore();

const snackbarStore = useSnackbarStore();

const { width, height } = useWindowSize();

const loading = ref<boolean>(false);
const passwordVisible = ref<boolean>(false);
const snackbarVisible = ref<boolean>(false);
const snackbarMessage = ref<string>("Wystąpił nieoczekiwany błąd");
const snackbarColor = ref<string>("info");

const loginSchema = yupObject({
  email: yupString()
    .required(() => "Podaj adres email")
    .email(() => "Podany adres email jest niepoprawny")
    .min(3, () => "Podany adres email jest za krótki")
    .max(320, () => "Podany adres email jest za długi")
    .trim(),
  password: yupString().required(() => "Podaj hasło"),
});

const validationSchema = toTypedSchema(loginSchema);

const { handleSubmit } = useForm({
  validationSchema,
});

const email = useField<string>("email");
const password = useField<string>("password");

const login = async (loginData: InferType<typeof loginSchema>) => {
  loading.value = true;
  try {
    const { token } = await $fetch(`/api/auth/customer/emailpass`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password,
      }),
    });

    await $fetch(`/api/auth/session`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        token,
      }),
    });

    const customer = await $fetch(`/api/customers/me`, {
      method: "GET",
      credentials: "include",
    });

    loading.value = false;

    snackbarMessage.value = "Zalogowano pomyślnie";
    snackbarColor.value = "success";
    snackbarVisible.value = true;

    sessionStore.session = customer as unknown as CustomerDTO;

    router.push(ROUTES.AFTER_LOGIN_HOMEPAGE);
  } catch (e) {
    console.log(e);
    const { message, color, timeout } = handleFetchError(e);
    if (message !== "") {
      snackbarStore.showSnackbar(message, color, timeout);
    }
    loading.value = false;
  }
};

const submit = handleSubmit((values) => {
  login(values);
});
</script>

<template>
  <v-card
    :max-width="width > 720 ? 500 : width * 0.8"
    class="login-form-wrapper"
    :loading="loading"
  >
    <template #title>Witamy ponownie</template>
    <template #subtitle>Zaloguj się na swoje konto</template>
    <template #text>
      <form class="login-form" @submit.prevent="submit">
        <v-text-field
          label="E-mail"
          placeholder="Podaj adres e-mail"
          autocomplete="email"
          type="email"
          v-model="email.value.value"
          :error-messages="email.errorMessage.value"
        >
          <template #append-inner>
            <v-icon icon="mdi-email-outline" />
          </template>
        </v-text-field>
        <v-text-field
          label="Hasło"
          placeholder="Podaj hasło"
          autocomplete="password"
          :type="passwordVisible ? 'text' : 'password'"
          counter="40"
          v-model="password.value.value"
          :error-messages="password.errorMessage.value"
          :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="passwordVisible = !passwordVisible"
        >
          <!-- <template #append-inner>
            <v-icon icon="mdi-lock-outline" />
          </template> -->
        </v-text-field>
        <NuxtLink
          :to="ROUTES.FORGOT_PASSWORD_PAGE"
          class="link forgot-password-link"
          >Nie pamiętam hasła</NuxtLink
        >
        <v-btn color="primary" type="submit" :loading="loading"
          >Zaloguj się</v-btn
        >
      </form>
      <p class="no-account-text">
        Nie masz jeszcze konta?
        <NuxtLink :to="ROUTES.SIGN_UP_PAGE" class="link"
          >Zarejestruj się</NuxtLink
        >
      </p>
    </template>
  </v-card>
</template>

<style lang="scss" scoped>
.login-form-wrapper {
  .no-account-text {
    margin-top: 1rem;
    text-align: center;
    font-size: 1rem;
  }

  .link {
    opacity: 0.62;
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      opacity: 1;
    }
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .forgot-password-link {
    height: 35px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
