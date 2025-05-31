<script setup lang="ts">
const emit = defineEmits(['created']);

const isActive = ref(false);
const showParcelLockerDialog = ref(false);
const formRef = ref();

const form = ref({
  firstName: '',
  lastName: '',
  company: '',
  vatNumber: '',
  postalCode: '',
  city: '',
  street: '',
  appartment: '',
  phoneNumber: '',
  wantsInvoice: false,
  differentThanShipping: false,
  isDefaultBilling: false,
  isDefaultShipping: false,
  parcelLockerName: '',
  parcelLockerCity: '',
  parcelLockerStreet: '',
  parcelLockerPostalCode: '',
  parcelLockerProvince: '',
  parcelLockerBuildingNumber: ''
});

const required = (v: string) => !!v || 'To pole jest wymagane';
const vatRule = (v: string) =>
  !form.value.wantsInvoice || (v.length === 10 && /^\d+$/.test(v)) || 'NIP musi mieć 10 cyfr';

watch(() => form.value.wantsInvoice, (val) => {
  if (!val) {
    form.value.vatNumber = '';
    form.value.differentThanShipping = false;
    form.value.isDefaultBilling = false;
  }
});

const resetForm = () => {
  form.value = {
    firstName: '',
    lastName: '',
    company: '',
    vatNumber: '',
    postalCode: '',
    city: '',
    street: '',
    appartment: '',
    phoneNumber: '',
    wantsInvoice: false,
    differentThanShipping: false,
    isDefaultBilling: false,
    isDefaultShipping: false,
    parcelLockerName: '',
    parcelLockerCity: '',
    parcelLockerStreet: '',
    parcelLockerPostalCode: '',
    parcelLockerProvince: '',
    parcelLockerBuildingNumber: ''
  };
};

const closeDialog = () => {
  resetForm();
  isActive.value = false;
};

const setOrChangeParcelLocker = (name: any, address: any) => {
  form.value.parcelLockerName = name;
  form.value.parcelLockerCity = address.city;
  form.value.parcelLockerPostalCode = address.post_code;
  form.value.parcelLockerStreet = address.street;
  form.value.parcelLockerProvince = address.province;
  form.value.parcelLockerBuildingNumber = address.building_number;
  showParcelLockerDialog.value = false;
};

const submitAddress = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  try {
    const { error } = await useFetch('/api/customers/me/addresses', {
      method: 'POST',
      credentials: 'include',
      body: {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        company: form.value.company,
        address_1: form.value.street,
        address_2: form.value.appartment,
        city: form.value.city,
        country_code: 'pl',
        postalCode: form.value.postalCode,
        phoneNumber: form.value.phoneNumber,
        is_default_billing: form.value.isDefaultBilling,
        is_default_shipping: form.value.isDefaultShipping,
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
      }
    });

    if (error.value) throw error.value;

    closeDialog();
    // location.reload(); // później emit
    emit('created');
  } catch (err) {
    console.error('Błąd zapisu adresu:', err);
  }
};
</script>

<template>
  <div class="add-new-address-card-wrapper">
    <v-dialog v-model="isActive" max-width="600">
      <template #activator="{ props }">
        <v-btn v-bind="props" color="#ff5c8a" icon="mdi-plus" variant="text" />
      </template>

      <template #default>
        <v-card title="Dodaj nowy adres" class="pa-4">
          <v-form ref="formRef">
            <!-- 👤 Dane odbiorcy -->
            <v-text-field label="Imię*" v-model="form.firstName" :rules="[required]" autocomplete="given-name" />
            <v-text-field label="Nazwisko*" v-model="form.lastName" :rules="[required]" autocomplete="family-name" />
            <v-text-field label="Telefon*" v-model="form.phoneNumber" :rules="[required]" autocomplete="tel-national" />

            <!-- 📦 Adres dostawy -->
            <v-text-field label="Kod pocztowy*" v-model="form.postalCode" :rules="[required]" autocomplete="postal-code" />
            <v-text-field label="Miasto*" v-model="form.city" :rules="[required]" autocomplete="address-level2" />
            <v-text-field label="Ulica*" v-model="form.street" :rules="[required]" autocomplete="address-line1" />
            <v-text-field label="Nr domu/lokalu*" v-model="form.appartment" :rules="[required]" autocomplete="address-line2" />

            <!-- 🧾 Faktura -->
            <v-checkbox label="Dodaj dane do faktury" v-model="form.wantsInvoice" />
            <template v-if="form.wantsInvoice">
              <v-text-field label="Nazwa firmy" v-model="form.company" autocomplete="organization" />
              <v-text-field label="NIP" v-model="form.vatNumber" :rules="[vatRule]" autocomplete="off" />
              <v-checkbox label="Adres inny niż dostawy" v-model="form.differentThanShipping" />
              <v-checkbox label="Ustaw jako domyślny do faktury" v-model="form.isDefaultBilling" />
            </template>

            <!-- 🚚 Wysyłka + paczkomat -->
            <template v-if="!form.differentThanShipping">
              <v-checkbox label="Ustaw jako domyślny do wysyłki" v-model="form.isDefaultShipping" />
              <v-btn @click="showParcelLockerDialog = true" color="warning" class="mt-2">Wybierz paczkomat</v-btn>
            </template>

            <div class="form-actions mt-4">
              <v-btn color="primary" @click="submitAddress">Zapisz</v-btn>
              <v-btn variant="text" color="grey" @click="closeDialog">Anuluj</v-btn>
            </div>
          </v-form>
        </v-card>
      </template>
    </v-dialog>

    <!-- 🧭 Wybór paczkomatu -->
    <teleport to="body">
      <div class="overlay" v-show="showParcelLockerDialog" @click="showParcelLockerDialog = false">
        <v-card class="dialog-card" @click.stop>
          <v-card-title>Wybierz paczkomat</v-card-title>
          <v-card-text>
            <InpostGeoWidget
              :config="'parcelcollect247'"
              :sandbox="false"
              :language="'pl'"
              :token="'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwNDcyMjI1ODMsImlhdCI6MTczMTg2MjU4MywianRpIjoiNzYzYjgxYmQtNzZmMC00MDhkLWFhMDAtMDJhOWYzMWU3MTI1IiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTpfMUJmY1BtX09uMzBKV2VNVEtkUmM4VkVzMzhpN3Y5Ui14VzcxbDBaYk1BIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiYTVmMmQyMmEtYzAxMi00NTY5LTk5NmYtZTc0OTA4NTI0NGJjIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyIsInNpZCI6ImE1ZjJkMjJhLWMwMTItNDU2OS05OTZmLWU3NDkwODUyNDRiYyIsImFsbG93ZWRfcmVmZXJyZXJzIjoiamJlYXV0eXNrbGVwLnBsIiwidXVpZCI6IjlhODIwYmU2LTJmMjItNDA1Ny05MTBlLThiODEwMDg5M2M3NCJ9.Hi1EmMvBsGwJO8JyaqV0AukG2iWJ9uhSStqBe4MCJG-4i6Ndb4jjEx_tYmUxuymKJeKKnLiti1PnQE3ZOMgFNJsnb1ZPKfcM0kGe-llD5RnbKsBqPQEJYon2vxMAeG_-ZjYy9NjwhhVZ35XD-1ERA-6Ah-7EgquUwl_fgN6i81ameJHD0yu4oci4t_DBMWQ8eHwaL1HOB3uMIksVIVTvbrAU4rZ5WKLSrVpw2j50mWxMAgrk-2c94NnO4zWM8nmjYPjw-H-JkFORLXHDFaQyVdC_aYCvdnJe7l0r2iSAQNvlT_F4iwjc3QKZ0Zfb9yCeVXPzbEBqml9xGenNOSxpyA'"
              @onpointselect="(point) => setOrChangeParcelLocker(point.name, point.address_details)"
            />
          </v-card-text>
        </v-card>
      </div>
    </teleport>
  </div>
</template>

<style scoped lang="scss">
.add-new-address-card-wrapper {
  padding: 1rem;
  border-radius: 8px;
  border: 1px dashed #ff5c8a;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    border: 1px solid #ff5c8a;
    cursor: pointer;
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999; // NA PEWNO ponad Vuetify dialog
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-card {
  max-width: 700px;
  width: 100%;
  z-index: 10000;
}

::v-deep iframe {
  z-index: 10001 !important;
  position: relative !important;
  pointer-events: auto !important;
}
</style>
