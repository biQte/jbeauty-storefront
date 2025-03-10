<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import {
  object as yupObject,
  string as yupString,
  ref as yupRef,
  type InferType,
} from "yup";
import { ROUTES } from "../constants/routes";

useSeoMeta({
  title: "JBeauty - Resetowanie hasła",
  ogTitle: "JBeauty - Resetowanie hasła",
});

const { width } = useWindowSize();
const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const snackarStore = useSnackbarStore();

const passwordVisible = ref<boolean>(false);
const rePasswordVisible = ref<boolean>(false);

const resetPasswordSchema = yupObject({
  email: yupString(),
  password: yupString()
    .required(() => "Hasło jest wymagane")
    .min(8, (value) => "Podane hasło jest za krótkie")
    .max(40, (value) => "Podane hasło jest za długie")
    .matches(/[a-z]+/, () => "Hasło musi zawierać małą literę")
    .matches(/[A-Z]+/, () => "Hasło musi zawierać dużą literę")
    .matches(/[0-9]+/, () => "Hasło musi zawierać cyfrę")
    .matches(
      /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]+/,
      () => "Hasło musi zawierać znak specjalny"
    ),
  rePassword: yupString()
    .required(() => "Powtórz hasło")
    .oneOf([yupRef("password")], () => {
      "Podane hasła nie są takie same";
    }),
});

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(resetPasswordSchema),
});

const email = useField<string>("email");
const password = useField<string>("password");
const rePassword = useField<string>("rePassword");

const resetPassword = async (
  resetPasswordData: InferType<typeof resetPasswordSchema>
) => {
  try {
    const response = await $fetch(`/api/auth/customer/emailpass/update`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${route.query.token}`,
      },
      body: JSON.stringify({
        email: resetPasswordData.email,
        password: resetPasswordData.password,
      }),
    });

    snackarStore.showSnackbar("Zresetowano hasło", "success", 5000);
    router.push(ROUTES.LOGIN_PAGE);
  } catch (e: any) {
    snackarStore.showSnackbar(e.toString(), "error", 5000);
  }
};

const submitForm = handleSubmit((values) => {
  resetPassword(values);
});

const submit = () => {
  submitForm();
};

onMounted(() => {
  if (!route.query.email || !route.query.token) {
    snackarStore.showSnackbar("Nieprawidłowy link", "error", 5000);
    return;
  }

  email.value.value = route.query.email as string;
});
</script>

<template>
  <v-card :max-width="width > 720 ? 500 : width * 0.8">
    <template v-slot:title>Resetowanie hasła</template>
    <template v-slot:subtitle>Podaj nowe hasło</template>
    <template v-slot:text>
      <form @submit.prevent="submit" class="reset-password-form">
        <v-text-field
          disabled
          v-model="email.value.value"
          label="E-mail"
          :error-messages="email.errorMessage.value"
          ><template #append-inner><v-icon icon="mdi-email-outline" /></template
        ></v-text-field>
        <v-text-field
          label="Hasło"
          placeholder="Wprowadź nowe hasło"
          autocomplete="new-password"
          :type="passwordVisible ? 'text' : 'password'"
          counter="40"
          v-model="password.value.value"
          :error-messages="password.errorMessage.value"
          :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="passwordVisible = !passwordVisible"
        ></v-text-field>
        <v-text-field
          label="Powtórz hasło"
          placeholder="Powtórz nowe hasło"
          autocomplete="new-password"
          :type="rePasswordVisible ? 'text' : 'password'"
          counter="40"
          v-model="rePassword.value.value"
          :error-messages="rePassword.errorMessage.value"
          :append-inner-icon="rePasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="rePasswordVisible = !rePasswordVisible"
        ></v-text-field>
        <v-btn
          color="primary"
          type="submit"
          :disabled="!route.query.email || !route.query.token"
          >Zresetuj hasło</v-btn
        >
      </form>
    </template>
  </v-card>
</template>

<style lang="scss" scoped></style>
