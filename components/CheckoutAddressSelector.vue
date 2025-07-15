<script setup lang="ts">
const emit = defineEmits(['fill-form']);

const sessionStore = useSessionStore();

const addresses = ref<any[]>([]);
const loading = ref(true);

const fetchAddresses = async () => {
  loading.value = true;
  try {
    const { data, error } = await useFetch('/api/customers/me/addresses', { credentials: 'include' });
    if (error.value) throw error.value;
    addresses.value = data.value || [];
    if(!data.value) return;
    console.log('Pobrane adresy:', addresses.value);
    const defaultShipping = addresses.value.find((address) => address.is_default_shipping === true);
    
    emit('fill-form', {
        id: defaultShipping.id,
        firstName: defaultShipping.first_name,
        lastName: defaultShipping.last_name,
        phoneNumber: defaultShipping.phone,
        postalCode: defaultShipping.postal_code,
        city: defaultShipping.city,
        street: defaultShipping.address_1,
        appartment: defaultShipping.address_2,
        wantsInvoice: defaultShipping.metadata?.wantsInvoice ?? false,
        differentThanShipping: defaultShipping.metadata?.differentThanShipping ?? false,
        company: defaultShipping.company || '',
        vatNumber: defaultShipping.metadata?.vatNumber || '',
        parcelLockerName: defaultShipping.metadata?.parcelLockerName || '',
        parcelLockerCity: defaultShipping.metadata?.parcelLockerCity || '',
        parcelLockerStreet: defaultShipping.metadata?.parcelLockerStreet || '',
        parcelLockerPostalCode: defaultShipping.metadata?.parcelLockerPostalCode || '',
        parcelLockerProvince: defaultShipping.metadata?.parcelLockerProvince || '',
        parcelLockerBuildingNumber: defaultShipping.metadata?.parcelLockerBuildingNumber || '',
    });

    const defaultBilling = addresses.value.find((addresses) => addresses.is_default_billing === true);

    if(defaultShipping.id !== defaultBilling?.id) {
      emit('fill-form', {
        id: defaultBilling?.id,
        firstName: defaultBilling.first_name,
        lastName: defaultBilling.last_name,
        phoneNumber: defaultBilling.phone,
        postalCode: defaultBilling.postal_code,
        city: defaultBilling.city,
        street: defaultBilling.address_1,
        appartment: defaultBilling.address_2,
        wantsInvoice: defaultBilling.metadata?.wantsInvoice ?? false,
        differentThanShipping: defaultBilling.metadata?.differentThanShipping ?? false,
        company: defaultBilling.company || '',
        vatNumber: defaultBilling.metadata?.vatNumber || '',
        parcelLockerName: defaultBilling.metadata?.parcelLockerName || '',
        parcelLockerCity: defaultBilling.metadata?.parcelLockerCity || '',
        parcelLockerStreet: defaultBilling.metadata?.parcelLockerStreet || '',
        parcelLockerPostalCode: defaultBilling.metadata?.parcelLockerPostalCode || '',
        parcelLockerProvince: defaultBilling.metadata?.parcelLockerProvince || '',
        parcelLockerBuildingNumber: defaultBilling.metadata?.parcelLockerBuildingNumber || '',
      });
    }
  } catch (e) {
    console.error('Błąd podczas pobierania adresów:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAddresses);

const useAddress = (addr: any) => {
  emit('fill-form', {
    id: addr.id,
    firstName: addr.first_name,
    lastName: addr.last_name,
    phoneNumber: addr.phone,
    postalCode: addr.postal_code,
    city: addr.city,
    street: addr.address_1,
    appartment: addr.address_2,
    wantsInvoice: addr.metadata?.wantsInvoice ?? false,
    differentThanShipping: addr.metadata?.differentThanShipping ?? false,
    company: addr.company || '',
    vatNumber: addr.metadata?.vatNumber || '',
    parcelLockerName: addr.metadata?.parcelLockerName || '',
    parcelLockerCity: addr.metadata?.parcelLockerCity || '',
    parcelLockerStreet: addr.metadata?.parcelLockerStreet || '',
    parcelLockerPostalCode: addr.metadata?.parcelLockerPostalCode || '',
    parcelLockerProvince: addr.metadata?.parcelLockerProvince || '',
    parcelLockerBuildingNumber: addr.metadata?.parcelLockerBuildingNumber || '',
  });
};
</script>

<template>
  <div class="checkout-address-selector">
    <p class="text-sm font-medium mb-2">Wybierz zapisany adres:</p>

    <div v-if="loading">Ładowanie adresów...</div>
    <div v-else-if="!sessionStore.isAuthenticated">Zaloguj się aby przeglądać zapisane adresy.</div>
    <div v-else-if="addresses.length === 0 && sessionStore.isAuthenticated">
      <p>Nie masz jeszcze zapisanych adresów.</p>
      <AddNewAddressCard @created="fetchAddresses" />
    </div>

    <div v-else class="saved-addresses">
      <SavedAddressCard @click="useAddress(address)" v-for="address in addresses" :key="address.id" v-bind="address" @updated="fetchAddresses" @deleted="fetchAddresses" />
      <AddNewAddressCard @created="fetchAddresses" />
    </div>

    <!-- <ul v-else class="space-y-2">
      <li
        v-for="address in addresses"
        :key="address.id"
        class="p-3 border rounded hover:bg-gray-50 cursor-pointer"
        @click="useAddress(address)"
      >
        <p class="font-semibold">{{ address.first_name }} {{ address.last_name }}</p>
        <p>{{ address.address_1 }}{{ address.address_2 ? ` ${address.address_2}` : '' }}, {{ address.postal_code }} {{ address.city }}</p>
        <p>{{ address.phone }}</p>
        <p v-if="address.metadata && address.metadata.parcelLockerName">Paczkomat: {{ address.metadata?.parcelLockerName }}</p>
        <p v-if="address.company">{{ address.company }}<span v-if="address.metadata && address.metadata.vatNumber">, {{ address.metadata.vatNumber }}</span></p>

        <div class="text-xs text-gray-500 mt-1">
          <span v-if="address.is_default_shipping && address.is_default_billing">Domyślny (wysyłka + faktura)</span>
          <span v-else-if="address.is_default_shipping">Domyślny do wysyłki</span>
          <span v-else-if="address.is_default_billing">Domyślny do faktury</span>
        </div>
      </li>
    </ul> -->
  </div>
</template>

<style scoped>
.checkout-address-selector {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;

  .saved-addresses {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 2rem;
    row-gap: 2rem;
    /* align-items: center; */

    @media only screen and (max-width: 1024px){
      grid-template-columns: 1fr 1fr;;
  }

    @media only screen and (max-width: 720px){
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
