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
import { useWindowSize } from "@vueuse/core";
import InpostGeoWidget from "~/components/InpostGeoWidget.vue";

const config = useRuntimeConfig();

const cartStore = useCartStore();
const sessionStore = useSessionStore();
const router = useRouter();
const route = useRoute();
const snackbarStore = useSnackbarStore();
const nuxtApp = useNuxtApp();
const { width, height } = useWindowSize();
const stripe = nuxtApp.$stripe;
let elements: any = null;
const savedAddresses = ref<any[]>([]);
const selectedAddressId = ref<string | null>(null);

const fetchSavedAddresses = async () => {
  const { data, error } = await useFetch('/api/customers/me/addresses', {
    credentials: 'include',
  });
  if (data.value) {
    savedAddresses.value = data.value;
  } else {
    console.error('Błąd pobierania adresów:', error.value);
  }
};

let stripeLoadingSuccess = ref<boolean>(true)

const setupStripe = async () => {
  if (!stripe) {
    snackbarStore.showSnackbar("Wystąpił nieoczekiwany błąd", "error", 5000);

    return;
  }

  await cartStore.fetchCart();

  if (!cartStore.cartObject) {
    snackbarStore.showSnackbar(
      "Nie udało się załadować koszyka",
      "error",
      5000
    );
    return;
  }

  const appearance = {};
  const options = {
    // paymentMethodType: selectedPaymentMethod.value?.includes("blik")
    //   ? "blik"
    //   : selectedPaymentMethod.value?.includes("przelewy24")
    //   ? "p24"
    //   : "card",
  };

  elements = stripe.elements({
    clientSecret: cartStore.cartObject?.payment_collection
      ?.payment_sessions?.[0].data.client_secret as string,
    appearance,
    locale: "pl",
  });

  const paymentElement = elements.create("payment", options);

  paymentElement.mount("#payment-element");
};

const loadingStep = ref<boolean>(false);

useHead({
  script: [
    { src: "https://geowidget.inpost.pl/inpost-geowidget.js", defer: true },
  ],
  link: [
    {
      rel: "stylesheet",
      href: "https://geowidget.inpost.pl/inpost-geowidget.css",
    },
    {
      rel: "canonical",
      href: `${config.public.storeUrl}${route.path}`,
    },
  ],
});

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
    .email("Należy podać poprawny adres email")
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
const phoneNumber = useField<string>("phoneNumber");
const wantsInvoice = useField<boolean>("wantsInvoice");
const differentThanShipping = useField<boolean>("differentThanShipping");
const vatNumber = useField<string | undefined>("vatNumber");
const companyName = useField<string | undefined>("companyName");
const companyPostalCode = useField<string | undefined>("companyPostalCode");
const companyCity = useField<string | undefined>("companyCity");
const companyStreet = useField<string | undefined>("companyStreet");
const companyhouseNumber = useField<string | undefined>("companyHouseNumber");
const companyPhoneNumber = useField<string | undefined>("companyPhoneNumber");

const parcelLockerName = ref<string>("");
const parcelLockerCity = ref<string>("");
const parcelLockerPostalCode = ref<string>("");
const parcelLockerBuildingNumber = ref<string>("");
const parcelLockerProvince = ref<string>("");
const parcelLockerStreet = ref<string>("");
const showParcelLockerDialog = ref<boolean>(false);
const showParcelLockerDialogModel = ref<boolean>(true);

function updatePostalCode(value: string) {
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
        : "";
      houseNumber.value.value = newOptions.cartObject.shipping_address.address_2
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
            : undefined;
        companyName.value.value = newOptions.cartObject.shipping_address
          ?.company
          ? newOptions.cartObject.shipping_address.company
          : undefined;
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
          : undefined;
        companyCity.value.value = newOptions.cartObject.billing_address?.city
          ? newOptions.cartObject.billing_address.city
          : undefined;
        companyStreet.value.value = newOptions.cartObject.billing_address
          ?.address_1
          ? newOptions.cartObject.billing_address.address_1
          : undefined;
        companyhouseNumber.value.value = newOptions.cartObject.billing_address
          ?.address_2
          ? newOptions.cartObject.billing_address.address_2
          : undefined;
        companyPhoneNumber.value.value = newOptions.cartObject.billing_address
          ?.phone
          ? newOptions.cartObject.billing_address.phone
          : undefined;
        vatNumber.value.value = newOptions.cartObject.billing_address?.metadata
          ?.vatNumber
          ? (newOptions.cartObject.billing_address.metadata.vatNumber as string)
          : undefined;
        companyName.value.value = newOptions.cartObject.billing_address?.company
          ? newOptions.cartObject.billing_address.company
          : undefined;
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
      address_1: street.value.value,
      address_2: houseNumber.value.value,
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
              companyStreet.value.value,
            address_2: companyhouseNumber.value.value,
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

    await cartStore.fetchCart();

    if (order) {
      const { gtag } = useGtag();
      gtag("event", "purchase", {
        transaction_id: order?.order.id,
        affiliation: "JBeautySklep",
        currency: "PLN",
        value: order.order.total,
        tax: order.order?.tax_total,
        shipping: order.order?.shipping_total,
        items: order.order?.items.map((item: any) => ({
          item_id: item.id,
          item_name: item.product_title,
          price: item.total,
          quantity: item.quantity,
        })),
      });

      const { $fbq } = useNuxtApp();
      // @ts-expect-error
      $fbq("track", "Purchase", {
        transaction_id: order?.order?.id,
        affiliation: "JBeautySklep",
        value: order.order?.total,
        tax: order.order?.tax_total,
        shipping: order.order?.shipping_total,
        currency: "PLN",
        content_ids: order.order?.items.map((item: any) => item.product_id),
        content_type: "product",
      });
    }

    router.push(`${ROUTES.ORDER_CONFIRMATION_PAGE}/${order!.order.id}`);
  } catch (e) {
    snackbarStore.showSnackbar("Wystąpił nieoczekiwany błąd", "error", 5000);
  }
};

onMounted(async () => {
  await cartStore.fetchCart();

  if ((route.query.redirect_status as string) === "succeeded") {
    stripeLoadingSuccess.value = true;

    await completeCart();
  }

  stripeLoadingSuccess.value = false;
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
      const activePaymentSession =
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

      const { gtag } = useGtag();

      gtag("event", "add_payment_info", {
        currency: "PLN",
        value: cartStore.cartObject?.total, // Suma zamówienia
        payment_type: activePaymentSession.provider_id, // np. "blik", "credit_card", "paypal"
        items: cartStore.cartObject?.items?.map((item) => ({
          item_id: item.id,
          item_name: item.title,
          price: item.unit_price,
          quantity: item.quantity,
        })),
      });

      const { $fbq } = useNuxtApp();

      $fbq("track", "AddPaymentInfo", {
        // payment_method: activePaymentSession.provider_id, // np. "blik", "credit_card"
        value: cartStore.cartObject.total,
        currency: "PLN",
      });
    }

    if (step.value === 3) {
      await maybeSaveAddress();
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

const wasModifiedShipping = ref(false);
const wasModifiedBilling = ref(false);
const originalShippingAddressSnapshot = ref<any | null>(null);
const originalBillingAddressSnapshot = ref<any | null>(null);

function stripEmptyFields(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, v]) => v !== '' && v !== null && v !== undefined
    )
  );
}

const setOrChangeParcelLocker = (name: any, addressDetails: any) => {
  parcelLockerName.value = name;
  parcelLockerCity.value = addressDetails.city;
  parcelLockerPostalCode.value = addressDetails.post_code;
  parcelLockerBuildingNumber.value = addressDetails.building_number;
  parcelLockerProvince.value = addressDetails.province;
  parcelLockerStreet.value = addressDetails.street;
  showParcelLockerDialog.value = false;
};

onMounted(() => {
  isClient.value = true;

  document.addEventListener("onpointselect", (event: any) => {
    setOrChangeParcelLocker(
      event["detail"]["name"],
      event["detail"]["address_details"]
    );
  });

  fetchSavedAddresses();
});

const selectAddress = (address: any) => {
  selectedAddressId.value = address.id;
  // Uzupełnij formularz checkoutObject z danymi adresu
  form.value.first_name = address.first_name;
  form.value.last_name = address.last_name;
  form.value.address_1 = address.address_1;
  form.value.address_2 = address.address_2;
  form.value.city = address.city;
  form.value.postal_code = address.postal_code;
  form.value.country_code = address.country_code;
  form.value.phone = address.phone;
  form.value.company = address.company;
  form.value.metadata = address.metadata;
};

const handleAddressUpdated = () => {
  fetchSavedAddresses();
};

const fillAddressFromSaved = (address: any) => {
  if(!address.differentThanShipping){
    firstName.value.value = address.firstName;
    lastName.value.value = address.lastName;
    email.value.value = address.email;
    postalCode.value.value = address.postalCode;
    city.value.value = address.city;
    street.value.value = address.street;
    houseNumber.value.value = address.appartment;
    phoneNumber.value.value = address.phoneNumber;
    wantsInvoice.value.value = address.wantsInvoice || false;
    differentThanShipping.value.value =
      address.differentThanShipping || false;
    vatNumber.value.value = address.vatNumber || undefined;
    companyName.value.value = address.company || undefined;
    companyPostalCode.value.value = address.companyPostalCode || undefined;
    companyCity.value.value = address.companyCity || undefined;
    companyStreet.value.value = address.companyStreet || undefined;
    companyhouseNumber.value.value = address.companyHouseNumber || undefined;
    companyPhoneNumber.value.value = address.companyPhoneNumber || undefined;
    parcelLockerName.value = address.parcelLockerName && address.parcelLockerName.length > 0 ? address.parcelLockerName : '';
    parcelLockerCity.value = address.parcelLockerCity && address.parcelLockerCity.length > 0 ? address.parcelLockerCity : '';
    parcelLockerPostalCode.value = address.parcelLockerPostalCode && address.parcelLockerPostalCode.length > 0 ? address.parcelLockerPostalCode : '';
    parcelLockerBuildingNumber.value =
      address.parcelLockerBuildingNumber && address.parcelLockerBuildingNumber.length > 0 ? address.parcelLockerBuildingNumber : '';
    parcelLockerProvince.value = address.parcelLockerProvince && address.parcelLockerProvince.length > 0 ? address.parcelLockerProvince : '';
    parcelLockerStreet.value = address.parcelLockerStreet && address.parcelLockerStreet.length > 0 ? address.parcelLockerStreet : '';

    updatePhoneNumber(address.phoneNumber);
    updatePostalCode(address.postalCode);

    originalShippingAddressSnapshot.value = { ...address };
    console.log("Address filled from saved address", originalShippingAddressSnapshot.value);
  }
  if(address.differentThanShipping){
    companyName.value.value = address.company;
    companyPostalCode.value.value = address.postalCode;
    companyCity.value.value = address.city;
    companyStreet.value.value = address.street;
    companyhouseNumber.value.value = address.appartment;
    companyPhoneNumber.value.value = address.phoneNumber;
    vatNumber.value.value = address.vatNumber;
    differentThanShipping.value.value = true;
    wantsInvoice.value.value = address.wantsInvoice || false;

    updateCompanyPhoneNumber(address.phoneNumber);
    updateCompanyPostalCode(address.postalCode);

    originalBillingAddressSnapshot.value = { ...address };
    console.log("Billing address filled from saved address", originalBillingAddressSnapshot.value);
  }
};

const maybeSaveAddress = async () => {
  if (!wasModifiedShipping.value) return;

  const body = {
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    company: form.value.company,
    address_1: form.value.street,
    address_2: form.value.appartment,
    city: form.value.city,
    country_code: 'pl',
    postalCode: form.value.postalCode,
    phoneNumber: form.value.phoneNumber,
    is_default_billing: false,
    is_default_shipping: false,
    metadata: {
      wantsInvoice: form.value.wantsInvoice,
      differentThanShipping: form.value.differentThanShipping,
      vatNumber: form.value.vatNumber,
      parcelLockerName: form.value.parcelLockerName,
      parcelLockerCity: form.value.parcelLockerCity,
      parcelLockerStreet: form.value.parcelLockerStreet,
      parcelLockerPostalCode: form.value.parcelLockerPostalCode,
      parcelLockerProvince: form.value.parcelLockerProvince,
      parcelLockerBuildingNumber: form.value.parcelLockerBuildingNumber
    }
  };

  try {
    await $fetch('/api/customers/me/addresses', {
      method: 'POST',
      credentials: 'include',
      body
    });
    console.log('Adres został zapisany jako nowy.');
  } catch (e) {
    console.error('Nie udało się zapisać adresu:', e);
  }
};
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
      <h3>Dostawa</h3>
      <br />
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
      <!-- <div v-if="savedAddresses.length" class="saved-addresses">
        <p class="mb-2 text-sm font-semibold">Zapisane adresy:</p>
        <div class="flex flex-wrap gap-2">
          <SavedAddressCard
            v-for="addr in savedAddresses"
            :key="addr.id"
            v-bind="addr"
            @selected="selectAddress"
            @updated="handleAddressUpdated"
          />
        </div>
        <UDivider class="my-6" />
      </div> -->
      <CheckoutAddressSelector @fill-form="fillAddressFromSaved" />
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
            density="compact"
            class="text-input"
            autocomplete="postal-code"
            v-model="postalCode.value.value"
            :error-messages="postalCode.errorMessage.value"
            @input="updatePostalCode(postalCode.value.value)"
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
              @input="updateCompanyPostalCode(companyPostalCode!.value!.value!)"
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
              v-model="companyPhoneNumber.value.value"
              autocomplete="tel-national"
              :error-messages="companyPhoneNumber.errorMessage.value"
              @input="updateCompanyPhoneNumber(companyPhoneNumber!.value!.value!)"
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
              ?.find((option: any) => option.id === selectedShippingOption)
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
            </v-card>
          </div>
        </div>
      </form>
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
                  ?.find((option: any) => option.id === selectedShippingOption)
                  ?.name.toLowerCase()
                  .includes('paczkomat') &&
                !parcelLockerName)
            "
            v-if="
              step < 3 ||
              (step === 3 &&
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
