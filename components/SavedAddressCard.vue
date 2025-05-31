<script setup lang="ts">
const emit = defineEmits(['updated', 'deleted']);

const props = defineProps({
  id: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  city: { type: String, required: true },
  address_1: { type: String, required: true },
  address_2: { type: String, required: false },
  postal_code: { type: String, required: true },
  company: { type: String, required: false },
  phone: { type: String, required: true },
  metadata: { type: Object, required: false },
  is_default_billing: { type: Boolean, required: false },
  is_default_shipping: { type: Boolean, required: false },
});

const isEditActive = ref(false);
const showParcelLockerDialog = ref(false);
const formRef = ref();

const form = ref({
  firstName: props.first_name,
  lastName: props.last_name,
  city: props.city,
  street: props.address_1,
  appartment: props.address_2 || '',
  postalCode: props.postal_code,
  phoneNumber: props.phone,
  company: props.metadata?.company || '',
  vatNumber: props.metadata?.vatNumber || '',
  wantsInvoice: props.metadata?.wantsInvoice || false,
  differentThanShipping: props.metadata?.differentThanShipping || false,
  isDefaultBilling: props.is_default_billing || false,
  isDefaultShipping: props.is_default_shipping || false,
  parcelLockerName: props.metadata?.parcelLockerName || '',
  parcelLockerCity: props.metadata?.parcelLockerCity || '',
  parcelLockerStreet: props.metadata?.parcelLockerStreet || '',
  parcelLockerPostalCode: props.metadata?.parcelLockerPostalCode || '',
  parcelLockerProvince: props.metadata?.parcelLockerProvince || '',
  parcelLockerBuildingNumber: props.metadata?.parcelLockerBuildingNumber || '',
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
  Object.assign(form.value, {
    firstName: props.first_name,
    lastName: props.last_name,
    city: props.city,
    street: props.address_1,
    appartment: props.address_2 || '',
    postalCode: props.postal_code,
    phoneNumber: props.phone,
    company: props.company || '',
    vatNumber: props.metadata?.vatNumber || '',
    wantsInvoice: props.metadata?.wantsInvoice || false,
    differentThanShipping: props.metadata?.differentThanShipping || false,
    isDefaultBilling: props.is_default_billing || false,
    isDefaultShipping: props.is_default_shipping || false,
    parcelLockerName: props.metadata?.parcelLockerName || '',
    parcelLockerCity: props.metadata?.parcelLockerCity || '',
    parcelLockerStreet: props.metadata?.parcelLockerStreet || '',
    parcelLockerPostalCode: props.metadata?.parcelLockerPostalCode || '',
    parcelLockerProvince: props.metadata?.parcelLockerProvince || '',
    parcelLockerBuildingNumber: props.metadata?.parcelLockerBuildingNumber || '',
  });
};

const editAddress = () => {
  resetForm();
  isEditActive.value = true;
};

const cancelEdit = () => {
  resetForm();
  isEditActive.value = false;
};

const saveEditedAddress = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  try {
    const { error } = await useFetch(`/api/customers/me/addresses/${props.id}`, {
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
        phone: form.value.phoneNumber,
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
          parcelLockerBuildingNumber: form.value.parcelLockerBuildingNumber,
        }
      }
    });

    if (error.value) throw error.value;

    isEditActive.value = false;
    // location.reload();
    emit('updated');
  } catch (err) {
    console.error('Error updating address:', err);
  }
};

const deleteAddress = async () => {
  try {
    const { error } = await useFetch(`/api/customers/me/addresses/${props.id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (error.value) throw error.value;
    // location.reload();
    emit('deleted');
  } catch (err) {
    console.error('Error deleting address:', err);
  }
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
</script>

<template>
  <div class="address-card">
    <div class="data">
      <p>{{ props.first_name }} {{ props.last_name }}</p>
      <p>{{ props.postal_code }}, {{ props.city }}</p>
      <p>{{ props.address_1 }}{{ props.address_2 ? ` ${props.address_2}` : '' }}</p>
      <p>{{ props.phone }}</p>
      <p v-if="props.metadata && props.metadata.parcelLockerName">Paczkomat: {{ props.metadata?.parcelLockerName }}</p>
      <p v-if="props.company">{{ props.company }}<span v-if="props.metadata && props.metadata.vatNumber">, {{ props.metadata.vatNumber }}</span></p>

      <div class="badges">
        <v-chip v-if="props.is_default_shipping && props.is_default_billing" color="primary" size="small">Domyślny</v-chip>
        <v-chip v-else-if="props.is_default_shipping" color="primary" size="small">Domyślny do wysyłki</v-chip>
        <v-chip v-else-if="props.is_default_billing" color="primary" size="small">Domyślny do faktury</v-chip>
      </div>
    </div>

    <div class="actions">
      <v-btn color="primary" variant="text" @click="editAddress">Edytuj</v-btn>
      <v-btn color="error" variant="text" @click="deleteAddress">Usuń</v-btn>
    </div>

    <v-dialog v-model="isEditActive" max-width="640">
      <v-card title="Edytuj adres" class="pa-4">
        <v-form ref="formRef" class="form-grid">
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
              <v-btn color="primary" @click="saveEditedAddress">Zapisz</v-btn>
              <v-btn variant="text" color="grey" @click="cancelEdit">Anuluj</v-btn>
            </div>
          </v-form>
      </v-card>
    </v-dialog>

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
.address-card {
  border-radius: 8px;
  border: 1px solid #ff5c8a;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  height: 100%;

  .data {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    p {
      margin: 0;
      font-size: 14px;
      color: #333;
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .badges {
    margin-top: 0.5rem;
  }
}

.form-grid {
  display: grid;
  gap: 0.75rem;
}

.parcel-section {
  margin-top: 1rem;
}

.parcel-summary {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-card {
  width: 90vw;
  max-width: 600px;
  max-height: 80vh;
  overflow: auto;
  background-color: white;
  padding: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
