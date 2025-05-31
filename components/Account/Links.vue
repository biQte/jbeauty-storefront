<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const path = computed(() => {
    return route.path;
});

console.log('route', route);

console.log('path', path.value);
</script>

<template>
    <div class="account-page-toolbar">
      <v-toolbar
      density="compact"

      color="transparent"
    >
      <v-btn
        active-color="primary"
        rounded="false"
        :active="path === '/konto'"
        @click="router.push('/konto')"
      >
        Dane
      </v-btn>
      <v-btn
        active-color="primary"
        rounded="false"
        :active="path === '/konto/zamowienia'"
        @click="router.push('/konto/zamowienia')"
      >
        Zamówienia
      </v-btn>
      <v-btn
        active-color="primary"
        rounded="false"
        :active="path === '/konto/adresy'"
        @click="router.push('/konto/adresy')"
      >
        Adresy
      </v-btn>
    </v-toolbar>
    </div>
</template>

<style scoped lang="scss">
.account-page-toolbar{
  // width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
