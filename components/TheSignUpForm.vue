<script setup lang="ts">
import { ROUTES } from "../constants/routes";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import {
  object as yupObject,
  string as yupString,
  bool,
  ref as yupRef,
  type InferType,
} from "yup";
import { handleFetchError } from "~/utils/handleFetchError";
import { useWindowSize } from "@vueuse/core";

const { $medusaClient } = useNuxtApp();
const config = useRuntimeConfig();

const router = useRouter();

const snackarStore = useSnackbarStore();

const { width, height } = useWindowSize();

const passwordVisible = ref<boolean>(false);
const rePasswordVisible = ref<boolean>(false);

const getIsEmailValidAndAvailable = async (
  email: string
): Promise<boolean | null> => {
  try {
    // TODO: validate and check availability
    // const available = await medusaClient.auth.exists(email);
    // await medusaClient.auth.
    // console.log(available);

    // if (available.exists) {
    //   return false;
    // }

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const accountSchema = yupObject({
  firstName: yupString()
    .required(() => "Imię jest wymagane")
    .min(3, (value) => "Podane imię jest za krótkie")
    .max(50, (value) => "Podane imię jest za długie")
    .trim(),
  lastName: yupString()
    .required(() => "Nazwisko jest wymagane")
    .min(3, (value) => "Podane nazwisko jest za krótkie")
    .max(50, (value) => "Podane nazwisko jest za długie")
    .trim(),
  email: yupString()
    .required(() => "Email jest wymagany")
    .test({
      name: "is-valid-and-available",
      skipAbsent: true,
      async test(value, ctx) {
        if (!validateEmail(value)) {
          return ctx.createError({
            message: "Podany adres Email jest niepoprawny",
          });
        }

        const isEmailValidAndAvailable = await getIsEmailValidAndAvailable(
          value
        );

        switch (isEmailValidAndAvailable) {
          case null:
            return ctx.createError({
              message: "Nie udało się sprawdzić dostępności adresu Email",
            });
          case false:
            return ctx.createError({
              message: "Podany adres email jest już zajęty",
            });
        }

        return true;
      },
    })
    .trim(),
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
  tosAccepted: bool()
    .required(
      () => "Akceptacja regulaminu i polityki prywatności jest wymagana"
    )
    .isTrue(() => "Akceptacja regulaminu i polityki prywatności jest wymagana"),
});

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(accountSchema),
});

const firstName = useField<string>("firstName");
const lastName = useField<string>("lastName");
const email = useField<string>("email");
const password = useField<string>("password");
const rePassword = useField<string>("rePassword");
const tosAccepted = useField<boolean>("tosAccepted");
const snackbarVisible = ref<boolean>(false);
const snackbarColor = ref<string>("info");
const snackbarMessage = ref<string>("Wystąpił nieoczekiwany błąd");

const loading = ref<boolean>(false);

const signup = async (accountData: InferType<typeof accountSchema>) => {
  loading.value = true;
  try {
    const token = await $medusaClient.auth.register("customer", "emailpass", {
      email: accountData.email,
      password: accountData.password,
    });

    console.log("retrieved token");

    await fetch(`${config.public.medusaUrl}/store/customers`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-publishable-api-key": String(config.public.medusaPublishableKey),
      },
      body: JSON.stringify({
        first_name: accountData.firstName,
        last_name: accountData.lastName,
        email: accountData.email,
      }),
    });

    console.log("fetch completed");

    loading.value = false;
    snackbarMessage.value = "Zarejestrowano pomyślnie";
    snackbarColor.value = "success";
    snackbarVisible.value = true;
    router.push(ROUTES.LOGIN_PAGE);
  } catch (e) {
    console.error(e);
    const { message, color, timeout } = handleFetchError(e);
    if (message !== "") {
      snackarStore.showSnackbar(message, color, timeout);
    }
    loading.value = false;
  }
};

const submitForm = handleSubmit((values) => {
  signup(values);
});

const submit = () => {
  submitForm();
};
</script>

<template>
  <v-card
    :max-width="width > 720 ? 500 : width * 0.8"
    class="sign-up-form-wrapper"
    :loading="loading"
  >
    <template #title>Dołącz do nas</template>
    <template #subtitle>Utwórz swoje konto</template>
    <template #text>
      <form class="sign-up-form" @submit.prevent="submit">
        <div class="inputs-wrapper">
          <div class="names-wrapper">
            <v-text-field
              label="Imię"
              placeholder="Podaj imię"
              autocomplete="given-name"
              v-model="firstName.value.value"
              :error-messages="firstName.errorMessage.value"
            >
              <template #append-inner>
                <v-icon icon="mdi-card-account-details-outline" />
              </template>
            </v-text-field>
            <v-text-field
              label="Nazwisko"
              placeholder="Podaj nazwisko"
              autocomplete="family-name"
              v-model="lastName.value.value"
              :error-messages="lastName.errorMessage.value"
            >
              <template #append-inner>
                <v-icon icon="mdi-card-account-details-outline" />
              </template>
            </v-text-field>
          </div>
          <v-text-field
            label="E-mail"
            placeholder="Podaj e-mail"
            autocomplete="email"
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
            autocomplete="new-password"
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
          <v-text-field
            label="Powtórz hasło"
            placeholder="Powtórz hasło"
            autocomplete="new-password"
            :type="rePasswordVisible ? 'text' : 'password'"
            counter="40"
            v-model="rePassword.value.value"
            :error-messages="rePassword.errorMessage.value"
            :append-inner-icon="rePasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="rePasswordVisible = !rePasswordVisible"
          >
            <!-- <template #append-inner>
              <v-icon icon="mdi-lock-outline" />
            </template> -->
          </v-text-field>
        </div>
        <v-checkbox
          class="checkbox"
          v-model="tosAccepted.value.value"
          :error-messages="tosAccepted.errorMessage.value"
        >
          <template #label>
            <span class="accept-tos-label">
              <span>Akceptuję Regulamin i politykę prywatności</span>
            </span>
          </template>
        </v-checkbox>
        <v-btn
          color="primary"
          type="submit"
          class="submit-btn"
          :loading="loading"
        >
          Zarejestruj się
        </v-btn>
      </form>
      <p class="already-have-account-text">
        Masz już konto?
        <NuxtLink :to="ROUTES.LOGIN_PAGE" class="link">Zaloguj się</NuxtLink>
      </p>
    </template>
  </v-card>
</template>

<style lang="scss" scoped>
.sign-up-form-wrapper {
  .already-have-account-text {
    margin-top: 1rem;
    text-align: center;
    font-size: 1rem;
  }

  .link {
    opacity: 0.62;
    transform: opacity 0.2s cubic-bezier(0.4, 0.2, 1);

    &:hover {
      opacity: 1;
    }
  }

  .sign-up-form {
    display: flex;
    flex-direction: column;
    gap: 0;

    .inputs-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .v-input {
        height: 90px;
      }

      .names-wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;

        @media only screen and (max-width: 720px) {
          display: flex;
          flex-direction: column;
        }

        // .v-input {
        //   width: 226px;
        // }
      }
    }

    .accept-tos-label {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      font-size: 0.9rem;

      * {
        font-size: inherit;
      }
    }

    .submit-btn {
      margin-top: 0.5rem;
    }

    .checkbox {
      margin-left: -10px;

      .v-label {
        transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          opacity: 1;
        }
      }

      .v-input_details {
        margin-top: -10px;
        margin-left: 10px;
      }
    }
  }
}
</style>
