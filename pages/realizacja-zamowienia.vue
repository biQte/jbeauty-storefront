<script setup lang="ts">
useSeoMeta({
  title: "JBeauty - Realizacja zamówienia",
  ogTitle: "JBeauty - Realizacjia zamówienia",
});

import { useField, useForm, useIsFormValid } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import {
  object as yupObject,
  string as yupString,
  boolean as yupBoolean,
  type InferType,
} from "yup";
import type { HttpTypes, CartDTO } from "@medusajs/types";
import { ROUTES } from "../constants/routes";
import { FetchError } from "@medusajs/js-sdk";
// import { Stripe } from "stripe";
// import { loadStripe } from "@stripe/stripe-js";
import { useWindowSize } from "@vueuse/core";
import InpostGeoWidget from "~/components/InpostGeoWidget.vue";

useHead({
  script: [
    { src: "https://geowidget.inpost.pl/inpost-geowidget.js", defer: true },
  ],
  link: [
    {
      rel: "stylesheet",
      href: "https://geowidget.inpost.pl/inpost-geowidget.css",
    },
  ],
});

const config = useRuntimeConfig();

const cartStore = useCartStore();
const sessionStore = useSessionStore();
const router = useRouter();
const route = useRoute();
const snackbarStore = useSnackbarStore();
const nuxtApp = useNuxtApp();
// const stripe = nuxtApp.$stripe;
const { width, height } = useWindowSize();
// let stripe: any = null;
const stripe = nuxtApp.$stripe;
let elements: any = null;

let stripeLoadingSuccess = ref<boolean>(true);

// const stripePromise = loadStripe(String(config.public.stripePublicKey));

const setupStripe = async () => {
  // stripe = await stripePromise;

  if (!stripe) {
    snackbarStore.showSnackbar("Wystąpił nieoczekiwany błąd", "error", 5000);

    return;
  }

  // if (!selectedPaymentMethod.value) {
  //   snackbarStore.showSnackbar("Nie wybrano metody płatności", "error", 5000);

  //   return;
  // }

  const appearance = {};
  const options = {
    // paymentMethodType: selectedPaymentMethod.value?.includes("blik")
    //   ? "blik"
    //   : selectedPaymentMethod.value?.includes("przelewy24")
    //   ? "p24"
    //   : "card",
  };

  elements = stripe.elements({
    // @ts-expect-error
    clientSecret: cartStore.cartObject?.payment_collection
      ?.payment_sessions?.[0].data.client_secret as string,
    appearance,
    locale: "pl",
  });

  const paymentElement = elements.create("payment", options);

  paymentElement.mount("#payment-element");
};

const loadingStep = ref<boolean>(false);

const locales = [
  { country: "Polska", value: "pl" },
  { country: "Niemcy", value: "de" },
];

const country = ref(
  cartStore.cartObject?.shipping_address
    ? locales.find(
        (item) =>
          item.value === cartStore.cartObject?.shipping_address?.country_code
      )
    : locales.find((item) => item.value === "pl")
);

const orderDataSchema = yupObject({
  isAuthenticated: yupBoolean(),
  firstName: yupString()
    .required(() => "Należy podać imię")
    .min(3, () => "Podane imię jest za krótkie")
    .max(50, () => "Podane imię jest za długie")
    .trim(),
  lastName: yupString()
    .required(() => "Należy podać nazwisko")
    .min(3, () => "Podane nazwisko jest za krótkie")
    .max(100, () => "Podane nazwisko jest za długie")
    .trim(),
  email: yupString()
    .email()
    .trim()
    .when("isAuthenticated", {
      is: false,
      then: (schema) => schema.required("Należy podać Email"),
      otherwise: (schema) => schema.notRequired(),
    }),
  phoneNumber: yupString()
    .required("Należy podać numer telefonu")
    .matches(
      /^\d{3} \d{3} \d{3}$/,
      "Numer telefonu musi być w formacie XXX XXX XXX"
    ),
  postalCode: yupString()
    .required("Należy podać kod pocztowy")
    // .matches(/^\d{2}-\d{3}$/, "Kod pocztowy musi być w formacie XX-XXX")
    .min(5, "Kod pocztowy jest za krótki")
    .max(6, "Kod pocztowy jest za długi")
    .trim(),
  city: yupString()
    .required("Należy podać nazwę miasta")
    .min(2, "Podana nazwa miasta jest za krótka")
    .max(120, "Podana nazwa miasta jest za długa")
    .trim(),
  street: yupString()
    .required("Należy podać nazwę ulicy")
    .min(2, "Podana nazwa ulicy jest za krótka")
    .max(120, "Podana nazwa ulicy jest za długa")
    .trim(),
  houseNumber: yupString()
    .required("Należy podać numer domu/lokalu")
    .max(50, "Podany numer domu/lokalu jest za długi")
    .trim(),
  appartmentNumber: yupString()
    .max(50, "Podany numer apartamentu jest za długi")
    .trim(),
  wantsInvoice: yupBoolean(),
  differentThanShipping: yupBoolean(),
  vatNumber: yupString()
    .min(10, "Podany numer nip jest za krótki")
    .max(10, "Podany numer nip jest za długi")
    .trim()
    .when("wantsInvoice", {
      is: true,
      then: (schema) => schema.required("Należy podać numer nip"),
      otherwise: (schema) => schema.notRequired(),
    }),
  companyName: yupString()
    .min(3, "Podana nazwa firmy jest za krótka")
    .max(200, "Podana nazwa firmy jest za długa")
    .trim()
    .when("wantsInvoice", {
      is: true,
      then: (schema) => schema.required("Należy podać nazwę firmy"),
      otherwise: (schema) => schema.notRequired(),
    }),
  companyPhoneNumber: yupString()
    .matches(
      /^\d{3} \d{3} \d{3}$/,
      "Numer telefonu musi być w formacie XXX XXX XXX"
    )
    .when(["wantsInvoice", "differentThanShipping"], {
      is: true,
      then: (schema) => schema.required("Należy podać numer telefonu"),
      otherwise: (schema) => schema.notRequired(),
    }),
  companyPostalCode: yupString()
    // .matches(/^\d{2}-\d{3}$/, "Kod pocztowy musi być w formacie XX-XXX")
    .min(5, "Kod pocztowy jest za krótki")
    .max(6, "Kod pocztowy jest za długi")
    .trim()
    .when(["wantsInvoice", "differentThanShipping"], {
      is: true,
      then: (schema) => schema.required("Należy podać kod pocztowy"),
      otherwise: (schema) => schema.notRequired(),
    }),
  companyCity: yupString()
    .min(2, "Podana nazwa miasta jest za krótka")
    .max(120, "Podana nazwa miasta jest za długa")
    .trim()
    .when(["wantsInvoice", "differentThanShipping"], {
      is: true,
      then: (schema) => schema.required("Należy podać nazwę miasta"),
      otherwise: (schema) => schema.notRequired(),
    }),
  companyStreet: yupString()
    .min(2, "Podana nazwa ulicy jest za krótka")
    .max(120, "Podana nazwa ulicy jest za długa")
    .trim()
    .when(["wantsInvoice", "differentThanShipping"], {
      is: true,
      then: (schema) => schema.required("Należy podać nazwę ulicy"),
      otherwise: (schema) => schema.notRequired(),
    }),
  companyHouseNumber: yupString()
    .max(50, "Podany numer domu/lokalu jest za długi")
    .trim()
    .when(["wantsInvoice", "differentThanShipping"], {
      is: true,
      then: (schema) => schema.required("Należy podać numer domu/lokalu"),
      otherwise: (schema) => schema.notRequired(),
    }),
  companyAppartmentNumber: yupString()
    .max(50, "Podany numer apartamentu jest za długi")
    .trim(),
});

const step = ref<number>(1);
const stepperItems = ref(["Dostawa", "Dane", "Podsumowanie"]);
const selectedShippingOption = ref<string>();
const selectedPaymentMethod = ref<string>();
const editingForm = ref<boolean>(true);
const displayForm = computed(() => {
  if (cartStore.cartObject?.shipping_address?.first_name && !editingForm.value)
    return false;
  else return true;
});

const initialValues = {
  isAuthenticated: !!sessionStore.isAuthenticated,
  wantsInvoice: false,
  differentThanShipping: false,
};

const { handleSubmit, meta } = useForm({
  validationSchema: toTypedSchema(orderDataSchema),
  initialValues,
});

const isAuthenticated = useField<boolean>("isAuthenticated");
const firstName = useField<string>("firstName");
const lastName = useField<string>("lastName");
const email = useField<string>("email");
const postalCode = useField<string>("postalCode");
const city = useField<string>("city");
const street = useField<string>("street");
const houseNumber = useField<string>("houseNumber");
const appartmentNumber = useField<string>("appartmentNumber");
const phoneNumber = useField<string>("phoneNumber");
const wantsInvoice = useField<boolean>("wantsInvoice");
const differentThanShipping = useField<boolean>("differentThanShipping");
const vatNumber = useField<string>("vatNumber");
const companyName = useField<string>("companyName");
const companyPostalCode = useField<string>("companyPostalCode");
const companyCity = useField<string>("companyCity");
const companyStreet = useField<string>("companyStreet");
const companyhouseNumber = useField<string>("companyHouseNumber");
const companyAppartmentNumber = useField<string>("companyAppartmentNumber");
const companyPhoneNumber = useField<string>("companyPhoneNumber");

const parcelLockerName = ref<string>("");
const parcelLockerCity = ref<string>("");
const parcelLockerPostalCode = ref<string>("");
const parcelLockerBuildingNumber = ref<string>("");
const parcelLockerProvince = ref<string>("");
const parcelLockerStreet = ref<string>("");
const showParcelLockerDialog = ref<boolean>(false);
const showParcelLockerDialogModel = ref<boolean>(true);

function updatePostalCode(value: string) {
  if (cartStore.cartObject?.shipping_address?.country_code !== "pl") return;

  const digitsOnly = value.replace(/\D/g, "");

  if (digitsOnly.length <= 5) {
    postalCode.value.value =
      digitsOnly.slice(0, 2) +
      (digitsOnly.length > 2 ? "-" : "") +
      digitsOnly.slice(2);
  }
}

function updateCompanyPostalCode(value: string) {
  const digitsOnly = value.replace(/\D/g, "");

  if (digitsOnly.length <= 5) {
    companyPostalCode.value.value =
      digitsOnly.slice(0, 2) +
      (digitsOnly.length > 2 ? "-" : "") +
      digitsOnly.slice(2);
  }
}

function updatePhoneNumber(value: string) {
  const digitsOnly = value.replace(/\D/g, "");

  phoneNumber.value.value = digitsOnly.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

function updateCompanyPhoneNumber(value: string) {
  const digitsOnly = value.replace(/\D/g, "");

  companyPhoneNumber.value.value = digitsOnly
    .replace(/(\d{3})(?=\d)/g, "$1 ")
    .trim();
}

const getPromotionAmount = (promotionId: string) => {
  if (!cartStore.cartObject?.items) return;

  const discountAmount = cartStore.cartObject.items
    .flatMap((item) => item.adjustments)
    // @ts-expect-error
    .filter((adjustment) => adjustment.promotion_id === promotionId)
    // @ts-expect-error
    .reduce((sum, adjustment) => sum + adjustment.amount, 0);

  return discountAmount;
};

watch(
  cartStore,
  (newOptions) => {
    if (!newOptions.availableShippingOptions) return;
    if (
      !newOptions.availableShippingOptions?.some(
        (option) => option.id === selectedShippingOption.value
      )
    ) {
      // @ts-ignore
      selectedShippingOption.value =
        newOptions.availableShippingOptions.length > 0
          ? newOptions.availableShippingOptions[0].id
          : null;
    }

    if (newOptions.cartObject?.shipping_address?.first_name) {
      firstName.value.value = newOptions.cartObject?.shipping_address
        ?.first_name
        ? newOptions.cartObject?.shipping_address?.first_name
        : "";
      lastName.value.value = newOptions.cartObject?.shipping_address?.last_name
        ? newOptions.cartObject?.shipping_address?.last_name
        : "";
      email.value.value = newOptions.cartObject?.email
        ? newOptions.cartObject.email
        : "";
      postalCode.value.value = newOptions.cartObject.shipping_address
        .postal_code
        ? newOptions.cartObject.shipping_address.postal_code
        : "";
      city.value.value = newOptions.cartObject.shipping_address.city
        ? newOptions.cartObject.shipping_address.city
        : "";
      street.value.value = newOptions.cartObject.shipping_address.address_1
        ? newOptions.cartObject.shipping_address.address_1
            .split(" ")
            .slice(0, -1)
            .join(" ")
        : "";
      houseNumber.value.value = newOptions.cartObject.shipping_address.address_1
        ? newOptions.cartObject.shipping_address.address_1.split(" ").pop()!
        : "";
      appartmentNumber.value.value = newOptions.cartObject.shipping_address
        .address_2
        ? newOptions.cartObject.shipping_address.address_2
        : "";
      phoneNumber.value.value = newOptions.cartObject.shipping_address.phone
        ? newOptions.cartObject.shipping_address.phone
        : "";
      wantsInvoice.value.value = newOptions.cartObject.shipping_address
        ?.metadata?.wantsInvoice as boolean;
      differentThanShipping.value.value = newOptions.cartObject.shipping_address
        ?.metadata?.differentThanShipping as boolean;
      if (
        (newOptions.cartObject.shipping_address.metadata
          ?.wantsInvoice as boolean) &&
        (!newOptions.cartObject.shipping_address.metadata
          ?.differentThanShipping as boolean)
      ) {
        vatNumber.value.value =
          newOptions.cartObject.shipping_address?.metadata &&
          newOptions.cartObject.shipping_address.metadata.vatNumber
            ? (newOptions.cartObject.shipping_address.metadata
                .vatNumber as string)
            : "";
        companyName.value.value = newOptions.cartObject.shipping_address
          ?.company
          ? newOptions.cartObject.shipping_address.company
          : "";
      }

      if (
        (newOptions.cartObject.shipping_address.metadata
          ?.wantsInvoice as boolean) &&
        (newOptions.cartObject.shipping_address.metadata
          ?.differentThanShipping as boolean)
      ) {
        companyPostalCode.value.value = newOptions.cartObject.billing_address
          ?.postal_code
          ? newOptions.cartObject.billing_address.postal_code
          : "";
        companyCity.value.value = newOptions.cartObject.billing_address?.city
          ? newOptions.cartObject.billing_address.city
          : "";
        companyStreet.value.value = newOptions.cartObject.billing_address
          ?.address_1
          ? newOptions.cartObject.billing_address.address_1
              .split(" ")
              .slice(0, -1)
              .join(" ")
          : "";
        companyhouseNumber.value.value = newOptions.cartObject.billing_address
          ?.address_1
          ? newOptions.cartObject.billing_address.address_1.split(" ").pop()!
          : "";
        companyAppartmentNumber.value.value = newOptions.cartObject
          .billing_address?.address_2
          ? newOptions.cartObject.billing_address.address_2
          : "";
        companyPhoneNumber.value.value = newOptions.cartObject.billing_address
          ?.phone
          ? newOptions.cartObject.billing_address.phone
          : "";
        vatNumber.value.value = newOptions.cartObject.billing_address?.metadata
          ?.vatNumber
          ? (newOptions.cartObject.billing_address.metadata.vatNumber as string)
          : "";
        companyName.value.value = newOptions.cartObject.billing_address?.company
          ? newOptions.cartObject.billing_address.company
          : "";
      }

      if (
        newOptions.cartObject.shipping_address?.metadata
          ?.parcelLockerName as string
      ) {
        parcelLockerName.value = newOptions.cartObject.shipping_address
          ?.metadata?.parcelLockerName as string;
        parcelLockerCity.value = newOptions.cartObject.shipping_address
          ?.metadata?.parcelLockerCity as string;
        parcelLockerBuildingNumber.value = newOptions.cartObject
          .shipping_address?.metadata?.parcelLockerBuildingNumber as string;
        parcelLockerPostalCode.value = newOptions.cartObject.shipping_address
          ?.metadata?.parcelLockerPostalCode as string;
        parcelLockerProvince.value = newOptions.cartObject.shipping_address
          ?.metadata?.parcelLockerProvince as string;
        parcelLockerStreet.value = newOptions.cartObject.shipping_address
          ?.metadata?.parcelLockerStreet as string;
      }
    }
  },
  { immediate: true }
);

const submitForm = handleSubmit(async (values) => {
  try {
    const shippingAddress: HttpTypes.StoreAddAddress = {
      first_name: firstName.value.value,
      last_name: lastName.value.value,
      country_code: "pl",
      postal_code: postalCode.value.value,
      phone: phoneNumber.value.value,
      city: city.value.value,
      address_1: street.value.value + " " + houseNumber.value.value,
      address_2: appartmentNumber.value.value
        ? appartmentNumber.value.value
        : undefined,
      company:
        wantsInvoice.value.value && !differentThanShipping.value.value
          ? companyName.value.value
          : undefined,
      metadata: {
        vatNumber:
          wantsInvoice.value.value && !differentThanShipping.value.value
            ? vatNumber.value.value
            : undefined,
        wantsInvoice: !!wantsInvoice.value.value,
        differentThanShipping: !!differentThanShipping.value.value,
        parcelLockerName: parcelLockerName.value,
        parcelLockerCity: parcelLockerCity.value,
        parcelLockerBuildingNumber: parcelLockerBuildingNumber.value,
        parcelLockerPostalCode: parcelLockerPostalCode.value,
        parcelLockerProvince: parcelLockerProvince.value,
        parcelLockerStreet: parcelLockerStreet.value,
      },
    };

    const billingAddress: HttpTypes.StoreAddAddress =
      wantsInvoice.value.value && differentThanShipping.value.value
        ? {
            first_name: firstName.value.value,
            last_name: lastName.value.value,
            country_code: "pl",
            postal_code: companyPostalCode.value.value,
            phone: companyPhoneNumber.value.value,
            city: companyCity.value.value,
            address_1:
              companyStreet.value.value + " " + companyhouseNumber.value.value,
            address_2: companyAppartmentNumber.value.value
              ? companyAppartmentNumber.value.value
              : undefined,
            company: companyName.value.value,
            metadata: {
              vatNumber: vatNumber.value.value,
              wantsInvoice: wantsInvoice.value.value,
              differentThanShipping: !!differentThanShipping.value.value,
            },
          }
        : shippingAddress;

    await cartStore.updateCart(
      email.value.value,
      billingAddress,
      shippingAddress,
      undefined,
      undefined
    );
  } catch (e) {
    throw e;
  }
});

const submit = async () => {
  await submitForm();
};

const completeCart = async () => {
  try {
    await cartStore.fetchCart();

    const order = await cartStore.completeCart();

    if (order!.type === "cart") throw order?.error;

    router.push(`${ROUTES.ORDER_CONFIRMATION_PAGE}/${order!.order.id}`);
  } catch (e) {
    snackbarStore.showSnackbar("Wystąpił nieoczekiwany błąd", "error", 5000);
  }
};

// watch(
//   () => route.params,
//   async (newParams) => {
//     if (newParams.redirect_status === "succeeded") {
//       await completeCart();
//     }
//   }
// );
onMounted(async () => {
  await cartStore.fetchCart();

  if ((route.query.redirect_status as string) === "succeeded") {
    stripeLoadingSuccess.value = true;

    await completeCart();
  }

  stripeLoadingSuccess.value = false;

  if (!cartStore.cartObject?.shipping_address) {
    await cartStore.updateCountry("pl");
  } else {
    country.value = locales.find(
      (item) =>
        item.value === cartStore.cartObject?.shipping_address?.country_code
    );
  }
});

watch(country, async (newValue, oldValue) => {
  if (oldValue === newValue) return;

  await cartStore.updateCountry(newValue!.value);

  await cartStore.getAvailableShippingOptions();
});

const prevStep = () => {
  step.value--;
};

const nextStep = async () => {
  try {
    loadingStep.value = true;

    if (!cartStore.cartObject) throw new FetchError("Koszyk jest pusty");

    if (step.value === 1) {
      if (!selectedShippingOption.value) {
        throw new FetchError("Należy wybrać metodę dostawy");
      }
      if (
        // @ts-expect-error
        cartStore.cartObject?.shipping_methods?.length < 1 ||
        // @ts-expect-error
        cartStore.cartObject?.shipping_methods[0].shipping_option_id !==
          selectedShippingOption.value
      )
        await cartStore.addShippingMethod(selectedShippingOption.value);
    }

    if (step.value === 2) {
      if (
        cartStore.availableShippingOptions
          ?.find(
            (shippingOption) =>
              shippingOption.id ===
              cartStore.cartObject?.shipping_methods![0].shipping_option_id
          )
          ?.name.toLowerCase()
          .includes("paczkomat") &&
        !parcelLockerName.value
      ) {
        snackbarStore.showSnackbar("Należy wybrać paczkomat", "error", 5000);
        loadingStep.value = false;
        return;
      }
      await submit();
      await cartStore.retrievePaymentProviders();

      await cartStore.selectPaymentProvider(
        !cartStore.availableShippingOptions
          ?.find(
            (shippingOption) =>
              shippingOption.id ===
              cartStore.cartObject?.shipping_methods![0].shipping_option_id
          )
          ?.name.toLowerCase()
          .includes("pobranie")
          ? "pp_stripe_stripe"
          : "pp_system_default"
      );
      // if (
      //   // @ts-expect-error
      //   cartStore.cartObject.payment_collection?.payment_sessions?.[0].provider_id.includes(
      //     "stripe"
      //   )
      // ) {
      //   await setupStripe();
      // }
      const activePaymentSession =
        // @ts-expect-error
        cartStore.cartObject.payment_collection?.payment_sessions?.[0];

      if (!activePaymentSession) {
        snackbarStore.showSnackbar(
          "Brak aktywnej sesji płatności",
          "error",
          5000
        );
        return;
      }

      if (activePaymentSession.provider_id.startsWith("pp_stripe")) {
        await setupStripe();
      }
    }

    if (step.value === 3) {
      await completeCart();
    }

    if (step.value < 3) {
      step.value++;
    }

    loadingStep.value = false;
  } catch (e) {
    loadingStep.value = false;
    throw e;
  }
};

const form = ref();

watch(form, (newForm) => {
  form?.value.addEventListener("submit", async (event: any) => {
    event.preventDefault();

    const result = await stripe!.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${config.public.storeUrl}/realizacja-zamowienia`,
      },
    });

    if (result.error) {
      snackbarStore.showSnackbar(result.error.toString(), "error", 5000);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  });
});

const isClient = ref<boolean>(false);

const widgetHtml = ref<string>(
  `
      <inpost-geowidget
        id="geowidget"
        token="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwNDcyMjI1ODMsImlhdCI6MTczMTg2MjU4MywianRpIjoiNzYzYjgxYmQtNzZmMC00MDhkLWFhMDAtMDJhOWYzMWU3MTI1IiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTpfMUJmY1BtX09uMzBKV2VNVEtkUmM4VkVzMzhpN3Y5Ui14VzcxbDBaYk1BIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiYTVmMmQyMmEtYzAxMi00NTY5LTk5NmYtZTc0OTA4NTI0NGJjIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyIsInNpZCI6ImE1ZjJkMjJhLWMwMTItNDU2OS05OTZmLWU3NDkwODUyNDRiYyIsImFsbG93ZWRfcmVmZXJyZXJzIjoiamJlYXV0eXNrbGVwLnBsIiwidXVpZCI6IjlhODIwYmU2LTJmMjItNDA1Ny05MTBlLThiODEwMDg5M2M3NCJ9.Hi1EmMvBsGwJO8JyaqV0AukG2iWJ9uhSStqBe4MCJG-4i6Ndb4jjEx_tYmUxuymKJeKKnLiti1PnQE3ZOMgFNJsnb1ZPKfcM0kGe-llD5RnbKsBqPQEJYon2vxMAeG_-ZjYy9NjwhhVZ35XD-1ERA-6Ah-7EgquUwl_fgN6i81ameJHD0yu4oci4t_DBMWQ8eHwaL1HOB3uMIksVIVTvbrAU4rZ5WKLSrVpw2j50mWxMAgrk-2c94NnO4zWM8nmjYPjw-H-JkFORLXHDFaQyVdC_aYCvdnJe7l0r2iSAQNvlT_F4iwjc3QKZ0Zfb9yCeVXPzbEBqml9xGenNOSxpyA"
        config="parcelcollect247"
        style="width: 100%; height: 500px; overflow: hidden"
        language="pl">
      </inpost-geowidget>
    `
);

const setOrChangeParcelLocker = (name: any, addressDetails: any) => {
  parcelLockerName.value = name;
  parcelLockerCity.value = addressDetails.city;
  parcelLockerPostalCode.value = addressDetails.post_code;
  parcelLockerBuildingNumber.value = addressDetails.building_number;
  parcelLockerProvince.value = addressDetails.province;
  parcelLockerStreet.value = addressDetails.street;
  showParcelLockerDialog.value = false;

  // listenForParcelLockerSelect();
};

// let pointSelectListener: any = null;

// const addEventListenerForPointSelect = () => {
//   // if (pointSelectListener) {
//   //   document.removeEventListener("onpointselect", pointSelectListener);
//   // }

//   pointSelectListener = (event: any) => {
//     setOrChangeParcelLocker(event.detail.name, event.detail.address_details);
//   };

//   document.addEventListener("onpointselect", pointSelectListener);
// };

// watch(showParcelLockerDialog, (newValue) => {
//   if (newValue) {
//     // When dialog opens, add event listener
//     addEventListenerForPointSelect();
//   } else {
//     // When dialog closes, remove event listener
//     if (pointSelectListener) {
//       document.removeEventListener("onpointselect", pointSelectListener);
//     }
//   }
// });

let parcelLockerEventListener: any = null;

// watch(parcelLockerEventListener, (newValue) => {
// });

// const listenForParcelLockerSelect = () => {
//   document.removeEventListener("onpointselect", () => {});

//   document.addEventListener("onpointselect", (event: any) => {
//     setOrChangeParcelLocker(
//       event["detail"]["name"],
//       event["detail"]["address_details"]
//     );
//   });
// };

onMounted(() => {
  isClient.value = true;

  // const widget = document.getElementById("geowidget");
  // parcelLockerEventListener = document.addEventListener(
  //   "onpointselect",
  //   (event) => {
  //     setOrChangeParcelLocker(
  //       // @ts-expect-error
  //       event["detail"]["name"],
  //       // @ts-expect-error
  //       event["detail"]["address_details"]
  //     );
  //   }
  // );

  document.addEventListener("onpointselect", (event: any) => {
    setOrChangeParcelLocker(
      event["detail"]["name"],
      event["detail"]["address_details"]
    );
  });

  // listenForParcelLockerSelect();
  // addEventListenerForPointSelect();
});
</script>

<template>
  <v-stepper
    v-if="!cartStore.loading && !stripeLoadingSuccess"
    v-model="step"
    show-actions
    :items="stepperItems"
    :width="width < 720 ? width : 950"
    next-text="Dalej"
    prev-text="Wróć"
  >
    <template v-slot:item.1>
      <h3>Kraj i Dostawa</h3>
      <br />
      <v-select
        v-model="country"
        label="Kraj"
        :items="locales"
        item-title="country"
        item-value="value"
        return-object
        variant="solo"
      ></v-select>
      <v-radio-group
        v-model="selectedShippingOption"
        label="Wybierz metodę dostawy"
      >
        <!-- @vue-ignore -->
        <v-radio
          v-for="shippingOption in cartStore.availableShippingOptions"
          :key="shippingOption.id"
          :value="shippingOption.id"
          :label="
            shippingOption.name +
            ` ` +
            new Intl.NumberFormat('pl-PL', {
              style: 'currency',
              currency: 'PLN',
            }).format(shippingOption.amount)
          "
        ></v-radio>
      </v-radio-group>
    </template>
    <template v-slot:item.2>
      <h2>Dane</h2>
      <br />
      <form @submit.prevent="submit" v-if="displayForm">
        <div class="input-row">
          <v-text-field
            density="compact"
            class="text-input"
            autocomplete="given-name"
            v-model="firstName.value.value"
            :error-messages="firstName.errorMessage.value"
            label="Imię*"
          ></v-text-field>
          <v-text-field
            density="compact"
            class="text-input"
            autocomplete="family-name"
            v-model="lastName.value.value"
            :error-messages="lastName.errorMessage.value"
            label="Nazwisko*"
          ></v-text-field>
          <v-text-field
            density="compact"
            class="text-input"
            autocomplete="email"
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            label="E-mail*"
            v-if="!sessionStore.isAuthenticated"
          ></v-text-field>
        </div>
        <h2>Adres dostawy</h2>
        <br />
        <div class="input-row">
          <v-text-field
            v-if="cartStore.cartObject?.shipping_address?.country_code === 'pl'"
            density="compact"
            class="text-input"
            autocomplete="postal-code"
            v-model="postalCode.value.value"
            :error-messages="postalCode.errorMessage.value"
            @input="updatePostalCode(postalCode.value.value)"
            label="Kod pocztowy*"
          ></v-text-field>
          <v-text-field
            v-if="cartStore.cartObject?.shipping_address?.country_code !== 'pl'"
            density="compact"
            class="text-input"
            autocomplete="postal-code"
            v-model="postalCode.value.value"
            :error-messages="postalCode.errorMessage.value"
            label="Kod pocztowy*"
          ></v-text-field>
          <v-text-field
            density="compact"
            class="text-input"
            v-model="city.value.value"
            autocomplete="address-level2"
            :error-messages="city.errorMessage.value"
            label="Miasto*"
          ></v-text-field>
        </div>
        <div class="input-row">
          <v-text-field
            density="compact"
            class="text-input"
            v-model="street.value.value"
            autocomplete="street-address"
            :error-messages="street.errorMessage.value"
            label="Ulica*"
          ></v-text-field>
          <v-text-field
            density="compact"
            class="text-input"
            v-model="houseNumber.value.value"
            :error-messages="houseNumber.errorMessage.value"
            label="Numer domu/lokalu*"
          ></v-text-field>
        </div>
        <div class="input-row">
          <v-text-field
            density="compact"
            class="text-input"
            v-model="appartmentNumber.value.value"
            :error-messages="appartmentNumber.errorMessage.value"
            label="Numer apartamentu"
          ></v-text-field>
          <v-text-field
            density="compact"
            class="text-input"
            v-model="phoneNumber.value.value"
            :error-messages="phoneNumber.errorMessage.value"
            @input="updatePhoneNumber(phoneNumber.value.value)"
            label="Numer telefonu*"
            autocomplete="tel-national"
          ></v-text-field>
        </div>
        <div class="input-row">
          <v-text-field
            density="compact"
            class="text-input"
            v-model="vatNumber.value.value"
            :error-messages="vatNumber.errorMessage.value"
            v-if="
              wantsInvoice.value.value && !differentThanShipping.value.value
            "
            label="Nip*"
            :counter="10"
          ></v-text-field>
          <v-text-field
            density="compact"
            class="text-input"
            v-model="companyName.value.value"
            autocomplete="organization"
            :error-messages="companyName.errorMessage.value"
            v-if="
              wantsInvoice.value.value && !differentThanShipping.value.value
            "
            label="Nazwa firmy*"
          ></v-text-field>
        </div>
        <v-checkbox
          density="compact"
          class="text-input"
          v-model="wantsInvoice.value.value"
          label="Chcę otrzymać fakturę"
        ></v-checkbox>
        <v-checkbox
          density="compact"
          class="text-input"
          v-if="wantsInvoice.value.value"
          v-model="differentThanShipping.value.value"
          label="Dane do faktury inne niż dostawy"
        ></v-checkbox>
        <div
          v-if="wantsInvoice.value.value && differentThanShipping.value.value"
          class="invoice-form"
        >
          <br />
          <h2>Dane do faktury</h2>
          <br />
          <div class="input-row">
            <v-text-field
              density="compact"
              class="text-input"
              autocomplete="postal-code"
              v-model="companyPostalCode.value.value"
              :error-messages="companyPostalCode.errorMessage.value"
              @input="updateCompanyPostalCode(companyPostalCode.value.value)"
              label="Kod pocztowy*"
            ></v-text-field>
            <v-text-field
              density="compact"
              class="text-input"
              autocomplete="address-level2"
              v-model="companyCity.value.value"
              :error-messages="companyCity.errorMessage.value"
              label="Miasto*"
            ></v-text-field>
          </div>
          <div class="input-row">
            <v-text-field
              density="compact"
              class="text-input"
              v-model="companyStreet.value.value"
              autocomplete="street-address"
              :error-messages="companyStreet.errorMessage.value"
              label="Ulica*"
            ></v-text-field>
            <v-text-field
              density="compact"
              class="text-input"
              v-model="companyhouseNumber.value.value"
              :error-messages="companyhouseNumber.errorMessage.value"
              label="Numer domu/lokalu*"
            ></v-text-field>
          </div>
          <div class="input-row">
            <v-text-field
              density="compact"
              class="text-input"
              v-model="companyAppartmentNumber.value.value"
              :error-messages="companyAppartmentNumber.errorMessage.value"
              label="Numer apartamentu"
            ></v-text-field>
            <v-text-field
              density="compact"
              class="text-input"
              v-model="companyPhoneNumber.value.value"
              autocomplete="tel-national"
              :error-messages="companyPhoneNumber.errorMessage.value"
              @input="updateCompanyPhoneNumber(companyPhoneNumber.value.value)"
              label="Numer telefonu*"
            ></v-text-field>
          </div>
          <div class="input-row">
            <v-text-field
              density="compact"
              class="text-input"
              v-model="vatNumber.value.value"
              :error-messages="vatNumber.errorMessage.value"
              label="Nip*"
              :counter="10"
            ></v-text-field>
            <v-text-field
              density="compact"
              class="text-input"
              v-model="companyName.value.value"
              autocomplete="organization"
              :error-messages="companyName.errorMessage.value"
              label="Nazwa firmy*"
            ></v-text-field>
          </div>
        </div>
        <div
          class="parcel-locker"
          v-if="
            cartStore.availableShippingOptions
              ?.find((option) => option.id === selectedShippingOption)
              ?.name.toLowerCase()
              .includes('paczkomat')
          "
        >
          <v-list v-if="parcelLockerName.length > 1">
            <v-list-item>
              <v-list-item-title><b>Wybrany paczkomat</b></v-list-item-title>
            </v-list-item>
            <v-list-item>
              {{ parcelLockerName }}
            </v-list-item>
            <v-list-item>
              {{ parcelLockerPostalCode }}, {{ parcelLockerCity }}
            </v-list-item>
            <v-list-item>
              {{ parcelLockerStreet }} {{ parcelLockerBuildingNumber }}
            </v-list-item>
            <p>
              W przypadku problemu ze zmianą paczkomatu, proszę odświeżyć
              stronę.
            </p>
          </v-list>

          <v-btn @click="showParcelLockerDialog = true" color="warning"
            >Wybierz paczkomat</v-btn
          >

          <div
            class="overlay"
            v-show="showParcelLockerDialog"
            @click="showParcelLockerDialog = false"
          >
            <v-card class="dialog-card" @click.stop>
              <v-card-title>Wybierz paczkomat</v-card-title>
              <v-card-text>
                <InpostGeoWidget
                  :config="'parcelcollect247'"
                  :sandbox="false"
                  :language="'pl'"
                  :token="'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwNDcyMjI1ODMsImlhdCI6MTczMTg2MjU4MywianRpIjoiNzYzYjgxYmQtNzZmMC00MDhkLWFhMDAtMDJhOWYzMWU3MTI1IiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTpfMUJmY1BtX09uMzBKV2VNVEtkUmM4VkVzMzhpN3Y5Ui14VzcxbDBaYk1BIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiYTVmMmQyMmEtYzAxMi00NTY5LTk5NmYtZTc0OTA4NTI0NGJjIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyIsInNpZCI6ImE1ZjJkMjJhLWMwMTItNDU2OS05OTZmLWU3NDkwODUyNDRiYyIsImFsbG93ZWRfcmVmZXJyZXJzIjoiamJlYXV0eXNrbGVwLnBsIiwidXVpZCI6IjlhODIwYmU2LTJmMjItNDA1Ny05MTBlLThiODEwMDg5M2M3NCJ9.Hi1EmMvBsGwJO8JyaqV0AukG2iWJ9uhSStqBe4MCJG-4i6Ndb4jjEx_tYmUxuymKJeKKnLiti1PnQE3ZOMgFNJsnb1ZPKfcM0kGe-llD5RnbKsBqPQEJYon2vxMAeG_-ZjYy9NjwhhVZ35XD-1ERA-6Ah-7EgquUwl_fgN6i81ameJHD0yu4oci4t_DBMWQ8eHwaL1HOB3uMIksVIVTvbrAU4rZ5WKLSrVpw2j50mWxMAgrk-2c94NnO4zWM8nmjYPjw-H-JkFORLXHDFaQyVdC_aYCvdnJe7l0r2iSAQNvlT_F4iwjc3QKZ0Zfb9yCeVXPzbEBqml9xGenNOSxpyA'"
                />
              </v-card-text>
              <!-- <v-card-actions>
                <v-btn @click="showParcelLockerDialogModel = false"
                  >Zamknij</v-btn
                >
              </v-card-actions> -->
            </v-card>
          </div>

          <!-- <v-dialog
            max-width="800"
            v-model="showParcelLockerDialogModel"
            v-if="showParcelLockerDialog"
            persistent
          >
            <v-card title="Wybierz paczkomat" min-height="500">
              <InpostGeoWidget
                :config="'parcelcollect247'"
                :sandbox="false"
                :language="'pl'"
                :token="'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwNDcyMjI1ODMsImlhdCI6MTczMTg2MjU4MywianRpIjoiNzYzYjgxYmQtNzZmMC00MDhkLWFhMDAtMDJhOWYzMWU3MTI1IiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTpfMUJmY1BtX09uMzBKV2VNVEtkUmM4VkVzMzhpN3Y5Ui14VzcxbDBaYk1BIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiYTVmMmQyMmEtYzAxMi00NTY5LTk5NmYtZTc0OTA4NTI0NGJjIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyIsInNpZCI6ImE1ZjJkMjJhLWMwMTItNDU2OS05OTZmLWU3NDkwODUyNDRiYyIsImFsbG93ZWRfcmVmZXJyZXJzIjoiamJlYXV0eXNrbGVwLnBsIiwidXVpZCI6IjlhODIwYmU2LTJmMjItNDA1Ny05MTBlLThiODEwMDg5M2M3NCJ9.Hi1EmMvBsGwJO8JyaqV0AukG2iWJ9uhSStqBe4MCJG-4i6Ndb4jjEx_tYmUxuymKJeKKnLiti1PnQE3ZOMgFNJsnb1ZPKfcM0kGe-llD5RnbKsBqPQEJYon2vxMAeG_-ZjYy9NjwhhVZ35XD-1ERA-6Ah-7EgquUwl_fgN6i81ameJHD0yu4oci4t_DBMWQ8eHwaL1HOB3uMIksVIVTvbrAU4rZ5WKLSrVpw2j50mWxMAgrk-2c94NnO4zWM8nmjYPjw-H-JkFORLXHDFaQyVdC_aYCvdnJe7l0r2iSAQNvlT_F4iwjc3QKZ0Zfb9yCeVXPzbEBqml9xGenNOSxpyA'"
              />
               <div class="geowidget" :v-html="widgetHtml"> 
               <inpost-geowidget
                id="geowidget"
                token="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwNDcyMjI1ODMsImlhdCI6MTczMTg2MjU4MywianRpIjoiNzYzYjgxYmQtNzZmMC00MDhkLWFhMDAtMDJhOWYzMWU3MTI1IiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTpfMUJmY1BtX09uMzBKV2VNVEtkUmM4VkVzMzhpN3Y5Ui14VzcxbDBaYk1BIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiYTVmMmQyMmEtYzAxMi00NTY5LTk5NmYtZTc0OTA4NTI0NGJjIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyIsInNpZCI6ImE1ZjJkMjJhLWMwMTItNDU2OS05OTZmLWU3NDkwODUyNDRiYyIsImFsbG93ZWRfcmVmZXJyZXJzIjoiamJlYXV0eXNrbGVwLnBsIiwidXVpZCI6IjlhODIwYmU2LTJmMjItNDA1Ny05MTBlLThiODEwMDg5M2M3NCJ9.Hi1EmMvBsGwJO8JyaqV0AukG2iWJ9uhSStqBe4MCJG-4i6Ndb4jjEx_tYmUxuymKJeKKnLiti1PnQE3ZOMgFNJsnb1ZPKfcM0kGe-llD5RnbKsBqPQEJYon2vxMAeG_-ZjYy9NjwhhVZ35XD-1ERA-6Ah-7EgquUwl_fgN6i81ameJHD0yu4oci4t_DBMWQ8eHwaL1HOB3uMIksVIVTvbrAU4rZ5WKLSrVpw2j50mWxMAgrk-2c94NnO4zWM8nmjYPjw-H-JkFORLXHDFaQyVdC_aYCvdnJe7l0r2iSAQNvlT_F4iwjc3QKZ0Zfb9yCeVXPzbEBqml9xGenNOSxpyA"
                language="pl"
                style="width: 100%; height: 500px; overflow: hidden"
                onpoint="onpointselect"
                config="parcelcollect247"
              ></inpost-geowidget>
              </div>
            </v-card>
          </v-dialog> -->
        </div>
      </form>
      <!-- <div class="saved-address" v-if="!displayForm">
        <v-list>
          <v-list-item
            ><template v-slot:title>Adres dostawy</template></v-list-item
          >
          <v-list-item>
            {{ cartStore.cartObject!.shipping_address!.first_name }}
            {{ cartStore.cartObject!.shipping_address!.last_name }}
          </v-list-item>
          <v-list-item>
            {{ cartStore.cartObject!.shipping_address!.address_1 }}
            <span v-if="cartStore.cartObject!.shipping_address!.address_2"
              >, {{ cartStore.cartObject!.shipping_address!.address_2 }}</span
            >
          </v-list-item>
          <v-list-item
            >{{ cartStore.cartObject!.shipping_address!.postal_code }},
            {{ cartStore.cartObject!.shipping_address!.city }}</v-list-item
          >
        </v-list>
        <v-list>
          <v-list-item
            ><template v-slot:title>Dane kontaktowe</template></v-list-item
          >
          <v-list-item>{{ cartStore.cartObject!.email }}</v-list-item>
          <v-list-item>{{
            cartStore.cartObject!.shipping_address!.phone
          }}</v-list-item>
        </v-list>
        <v-list>
          <v-list-item
            ><template v-slot:title>Adres rozliczeniowy</template></v-list-item
          >
          <v-list-item
            v-if="
              !wantsInvoice.value.value ||
              (wantsInvoice.value.value && !differentThanShipping.value.value)
            "
            >Taki sam jak adres dostawy</v-list-item
          >
          <v-list-item v-if="wantsInvoice.value.value">{{
            cartStore.cartObject!.billing_address?.company
          }}</v-list-item>
          <v-list-item v-if="wantsInvoice.value.value">{{
            cartStore.cartObject!.billing_address?.metadata?.vatNumber
          }}</v-list-item>
          <v-list-item
            v-if="wantsInvoice.value.value && differentThanShipping.value.value"
            >{{ cartStore.cartObject!.billing_address?.address_1 }}
            <span v-if="cartStore.cartObject!.billing_address?.address_2"
              >, {{ cartStore.cartObject!.billing_address.address_2 }}</span
            ></v-list-item
          >
          <v-list-item
            v-if="wantsInvoice.value.value && differentThanShipping.value.value"
            >{{ cartStore.cartObject!.billing_address?.postal_code }},
            {{ cartStore.cartObject!.billing_address?.city }}</v-list-item
          >
        </v-list>
        <v-btn variant="text" @click="editingForm = true">Edytuj</v-btn>
      </div> -->
    </template>
    <template v-slot:item.3>
      <h3>Zamówienie</h3>
      <br />
      <v-sheet border>
        <v-table>
          <thead>
            <tr>
              <th>Produkt</th>
              <th>Ilość</th>
              <th>Cena</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in cartStore.cartObject!.items"
              :key="product.id"
            >
              <td>{{ product.product_title }}</td>
              <td>{{ product.quantity }}</td>
              <td>
                <span :class="{ strike: product.compare_at_unit_price }">
                  {{
                    new Intl.NumberFormat("pl-PL", {
                      style: "currency",
                      currency: "PLN",
                    }).format(
                      Number(
                        product.compare_at_unit_price
                          ? product.compare_at_unit_price
                          : product.unit_price
                      ) * Number(product.quantity)
                    )
                  }}
                </span>
                <span class="sale-price" v-if="product.compare_at_unit_price">
                  &nbsp;{{
                    new Intl.NumberFormat("pl-PL", {
                      style: "currency",
                      currency: "PLN",
                    }).format(
                      Number(product.unit_price) * Number(product.quantity)
                    )
                  }}
                </span>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-sheet>
      <v-divider :opacity="0" :thickness="12"></v-divider>
      <!-- @vue-expect-error -->
      <v-sheet border v-if="cartStore.cartObject?.promotions.length > 0">
        <v-table>
          <thead>
            <tr>
              <th>Rabat</th>
              <th>Ilość</th>
              <th>Wartość</th>
            </tr>
          </thead>
          <tbody>
            <!-- @vue-ignore -->
            <tr v-for="promotion in cartStore.cartObject.promotions">
              <td>
                <i>{{ promotion.code }}</i>
              </td>
              <td>{{ promotion.application_method.value }}%</td>
              <td>
                <!-- @vue-ignore -->
                -{{
                  new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(getPromotionAmount(promotion.id))
                }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-sheet>
      <v-divider :opacity="0" :thickness="12"></v-divider>
      <v-sheet border>
        <v-table>
          <thead>
            <tr>
              <th>Dostawa</th>
              <th></th>
              <th>Cena</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <!-- @vue-ignore -->
                {{
                  cartStore.availableShippingOptions?.find(
                    (shippingOption) =>
                      shippingOption.id ===
                      cartStore.cartObject?.shipping_methods[0]
                        .shipping_option_id
                  )?.name
                }}
              </td>
              <td></td>
              <td>
                <!-- @vue-ignore -->
                {{
                  new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(cartStore.cartObject?.shipping_methods[0].amount)
                }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-sheet>
      <v-divider :thickness="16" :opacity="0"></v-divider>
      <!-- <v-sheet border>
        <v-table>
          <tbody>
            <tr>
              <th>Razem(Zawiera 23% VAT)</th>
              <th></th>
              <th> -->
      <h4>
        Razem(Zawiera 23% VAT)
        <span class="strike" v-if="cartStore.cartObject?.discount_total">{{
          new Intl.NumberFormat("pl-PL", {
            style: "currency",
            currency: "PLN",
          }).format(
            Math.floor(
              Number(cartStore.cartObject.item_total) +
                Number(cartStore.cartObject.discount_total) * 1.23 +
                Number(cartStore.cartObject.shipping_methods![0].amount)
            )
          ) + " "
        }}</span>
        <span :class="{ total: cartStore.cartObject?.discount_total }">
          <!-- @vue-ignore -->
          {{
            new Intl.NumberFormat("pl-PL", {
              style: "currency",
              currency: "PLN",
            }).format(cartStore.cartObject?.total)
          }}</span
        >
      </h4>
      <!-- </th>
            </tr>
          </tbody>
        </v-table>
      </v-sheet> -->
    </template>
    <template v-slot:actions>
      <v-stepper-actions>
        <template v-slot:prev>
          <v-btn :size="width < 720 ? 'small' : 'default'" @click="prevStep"
            ><v-icon icon="mdi-arrow-left-thin"></v-icon>
            {{ stepperItems[step - 2] }}</v-btn
          >
        </template>
        <template v-slot:next>
          <v-btn
            :loading="loadingStep"
            :size="width < 720 ? 'small' : 'default'"
            @click="nextStep"
            color="primary"
            :disabled="
              (!meta.valid &&
                step === 2 &&
                !cartStore.cartObject?.shipping_address?.first_name) ||
              (step === 2 &&
                cartStore.availableShippingOptions
                  ?.find((option) => option.id === selectedShippingOption)
                  ?.name.toLowerCase()
                  .includes('paczkomat') &&
                !parcelLockerName)
            "
            v-if="
              step < 3 ||
              (step === 3 &&
                // @ts-expect-error
                !cartStore.cartObject?.payment_collection?.payment_sessions?.[0].provider_id.includes(
                  'stripe'
                ))
            "
            >{{ stepperItems[step] ? stepperItems[step] : "Złóż zamówienie" }}
            <v-icon icon="mdi-arrow-right-thin"></v-icon>
          </v-btn>
        </template>
      </v-stepper-actions>
    </template>
    <form ref="form" id="payment-form">
      <div
        id="payment-element"
        v-show="
          step === 3 &&
          // @ts-expect-error
          cartStore.cartObject?.payment_collection?.payment_sessions?.[0].provider_id.includes(
            'stripe'
          )
        "
      ></div>
      <v-btn
        type="submit"
        id="submit"
        color="primary"
        :size="width < 720 ? 'small' : 'large'"
        v-show="
          step === 3 &&
          // @ts-expect-error
          cartStore.cartObject?.payment_collection?.payment_sessions?.[0].provider_id.includes(
            'stripe'
          )
        "
        >Zapłać i złóż zamówienie <v-icon icon="mdi-arrow-right-thin"></v-icon
      ></v-btn>
    </form>
  </v-stepper>
  <v-progress-circular
    indeterminate
    v-if="stripeLoadingSuccess"
  ></v-progress-circular>
</template>

<style lang="scss" scoped>
.invoice-form {
  display: flex;
  width: 100%;
  flex-direction: column;
}
.input-row {
  display: flex;
  width: 100%;
  gap: 2rem;
  @media only screen and (max-width: 720px) {
    flex-direction: column;
    gap: 0.2rem;
  }
  .text-input {
    max-width: calc(50% - 1rem);
    @media only screen and (max-width: 720px) {
      max-width: 100%;
    }
  }
}
.strike {
  text-decoration: line-through;
  opacity: 0.6;
}
.total {
  color: red;
}
h4 {
  text-align: end;
}
.saved-address {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
  align-items: start;
}
#geowidget {
  min-height: 500px;
}
.geowidget {
  height: 500px;
  width: 100%;
}

.v-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#payment-form {
  max-width: 80%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0 auto;

  #submit {
    align-self: end;
  }
}

.strike {
  text-decoration: line-through;
}

.sale-price {
  font-size: 1.2rem;
  color: $primary-color;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.dialog-card {
  width: 800px;
  max-width: 90%;
  height: 600px;
}
</style>
