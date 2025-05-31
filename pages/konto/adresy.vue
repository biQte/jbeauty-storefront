<script setup lang="ts">
interface CustomerAddress {
  id: string;
  first_name: string;
  last_name: string;
  city: string;
  address_1: string;
  company?: string;
  address_2?: string;
  postal_code: string;
  phone: string;
  metadata?: Record<string, any>;
}

const { width = 390, height = 500 } = useWindowSize();

const savedAddresses = ref<CustomerAddress[]>([]);

// Get saved addresses
const fetchAddresses = async () => {
  const { data, error } = await useFetch('/api/customers/me/addresses', {
    server: false,
    credentials: 'include',
  });

  if (error.value) {
    console.error('Error fetching addresses:', error.value);
    return [];
  }

  return data.value || [];
};

const handleChange = async (address: CustomerAddress) => {
  savedAddresses.value = await fetchAddresses();
};

onMounted(async () => {
  await nextTick();
  // await new Promise(resolve => setTimeout(resolve, 50)); // sztuczne opóźnienie
  savedAddresses.value = await fetchAddresses();

  console.log(savedAddresses.value);
});
</script>

<template>
    <v-sheet class="account-page-wrapper" :min-height="height * 0.7">
        <AccountLinks />
        <div class="saved-addresses">
          <SavedAddressCard v-for="address in savedAddresses" :key="address.id" v-bind="address" @updated="handleChange" @deleted="handleChange" />
          <AddNewAddressCard @created="handleChange" />
        </div>
    </v-sheet>
</template>

<style lang="scss" scoped>
.account-page-wrapper {
  // padding: 0 15%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  // height: 100%;
  width: 100%;

  @media only screen and (max-width: 720px) {
    flex-direction: column;
    margin: auto;
    align-items: center;
    justify-content: start;
    padding: 0;
  }

  .saved-addresses {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 2rem;
    row-gap: 2rem;

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
