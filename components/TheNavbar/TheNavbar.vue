<script setup lang="ts">
import { mergeProps } from "vue";
import type { ProductCategory } from "@medusajs/client-types";
import { useWindowSize } from "@vueuse/core";
const loading = ref<boolean>(false);

const cartStore = useCartStore();

const productCategories = ref();
const brands = ref();
const { width, height } = useWindowSize();
const nuxtApp = useNuxtApp();
const medusaClient = nuxtApp.$medusaClient;
const mobileMenu = ref<boolean>(false);

const productCategoryMenuOpen = ref<boolean>(false);
const brandCategoryMenuOpen = ref<boolean>(false);
const toggleProductCategoryMenu = () => {
  productCategoryMenuOpen.value = !productCategoryMenuOpen.value;
};
const toggleBrandCategoryMenu = () => {
  brandCategoryMenuOpen.value = !brandCategoryMenuOpen.value;
};

watch(mobileMenu, (newValue) => {
  if (newValue === false) {
    productCategoryMenuOpen.value = false;
    brandCategoryMenuOpen.value = false;
  }
});

const config = useRuntimeConfig();

const closeMenu = () => {
  mobileMenu.value = false;
};

onMounted(async () => {
  const cartId = localStorage.getItem("cart_id");

  // const { product_categories } = await medusaClient.store.category.retrieve(
  // {
  // handle: "produkty",
  // q: "pcat_01JCGXYYM4YXHB7W40TMC5WCXT",
  // include_descendants_tree: true,
  // fields: "*category_children",
  // }
  // );

  // const searchParams = new URLSearchParams({
  //   handle: "produkty",
  //   fields: "*category_children",
  // });
  // parent_category_id=pcat_01JCGXYYM4YXHB7W40TMC5WCXT
  // @ts-expect-error
  const { product_categories } = await $fetch(
    `${config.public.medusaUrl}/store/product-categories?include_descendants_tree=true&id=${config.public.productsCategoryID}&fields=*category_children`,
    {
      credentials: "include",
      headers: {
        "x-publishable-api-key": config.public.medusaPublishableKey,
      },
    }
  );

  productCategories.value = product_categories;

  // brands.value = await medusaClient.store.category.list({
  // handle: "marki",
  // include_descendants_tree: true,
  // });

  brands.value = await $fetch(
    `${config.public.medusaUrl}/store/product-categories?include_descendants_tree=true&id=${config.public.brandsCategoryID}&fields=*category_children`,
    {
      credentials: "include",
      headers: {
        "x-publishable-api-key": config.public.medusaPublishableKey,
      },
    }
  );

  console.log(productCategories.value);
  console.log(brands.value.product_categories);
  console.log(brands.value);

  if (!cartStore.cartObject && cartId !== null) {
    cartStore.fetchCart();
  }

  console.log("cart", cartStore.cartObject);
});
</script>

<template>
  <div class="navbar-wrapper">
    <div class="mobile-wrapper" v-if="width <= 1400">
      <div class="hamburger-and-logo-wrapper">
        <v-menu
          v-model="mobileMenu"
          location="end"
          :min-height="height"
          :width="width"
          scrim="#FFFFFF"
          opacity="100"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ props }">
            <v-btn variant="text" icon="mdi-menu" v-bind="props"></v-btn>
          </template>
          <v-card :min-height="height" class="menu-card">
            <v-btn
              icon="mdi-close"
              variant="text"
              @click="mobileMenu = false"
            ></v-btn>
            <ul class="mobile-menu">
              <ul class="product-categories">
                <TheNavbarMobileCategoryItem
                  :category="productCategories[0]"
                  @close-menu="closeMenu"
                />
              </ul>
              <ul class="product-categories">
                <TheNavbarMobileCategoryItem
                  :category="brands.product_categories[0]"
                  @close-menu="closeMenu"
                />
              </ul>
              <!-- <div class="d-flex align-center">
                <v-btn
                  to="/kategoria/produkty"
                  @click="closeMenu"
                  variant="text"
                  >Produkty</v-btn
                >
                <v-btn
                  variant="text"
                  icon="mdi-chevron-down"
                  @click="toggleProductCategoryMenu"
                ></v-btn>
              </div>
              <v-expand-transition>
                <ul v-show="productCategoryMenuOpen" class="product-categories">
                  <li
                    v-for="category in productCategories[0].category_children"
                    :key="category.id"
                  >
                    <v-btn
                      variant="text"
                      @click="closeMenu"
                      :to="`/kategoria/${category.handle}`"
                      >{{ category.name }}</v-btn
                    >
                  </li>
                </ul>
              </v-expand-transition> -->
              <!-- <div class="d-flex align-center">
                <v-btn to="/kategoria/marki" @click="closeMenu" variant="text"
                  >Marki</v-btn
                >
                <v-btn
                  variant="text"
                  icon="mdi-chevron-down"
                  @click="toggleBrandCategoryMenu"
                ></v-btn>
              </div>
              <v-expand-transition>
                <ul v-show="brandCategoryMenuOpen" class="product-categories">
                  <li
                    v-for="category in brands.product_categories[0]
                      .category_children"
                    :key="category.id"
                  >
                    <v-btn
                      @click="closeMenu"
                      variant="text"
                      :to="`/kategoria/${category.handle}`"
                      >{{ category.name }}</v-btn
                    >
                  </li>
                </ul>
              </v-expand-transition> -->
              <v-btn
                to="/nowosci"
                @click="closeMenu"
                class="mobile-menu-item"
                variant="text"
                >Nowości</v-btn
              >
              <v-btn
                to="/kody-rabatowe"
                @click="closeMenu"
                class="mobile-menu-item"
                variant="text"
                >Kody rabatowe</v-btn
              >
              <v-btn
                to="/kontakt"
                @click="closeMenu"
                class="mobile-menu-item"
                variant="text"
                >Kontakt</v-btn
              >
            </ul>
          </v-card>
        </v-menu>
        <NuxtLink to="/" class="logo">JBeauty</NuxtLink>
      </div>
      <div class="mobile-action-buttons">
        <TheNavbarTheMobileNavbarActionList />
      </div>
    </div>
    <div class="desktop-wrapper" v-if="width > 1400">
      <div class="navbar-wrapper-top">
        <NuxtLink to="/"><div class="logo">JBeauty</div></NuxtLink>
        <div class="search-bar">
          <TheNavbarSearchBar />
        </div>
        <TheNavbarActionList />
      </div>
      <div class="navbar-wrapper-bottom">
        <ul class="menu">
          <v-btn
            class="menu-link"
            variant="text"
            :to="`/`"
            :active="false"
            size="small"
            >Strona główna
          </v-btn>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                class="menu-link"
                variant="text"
                v-bind="props"
                size="small"
                >Produkty</v-btn
              >
            </template>
            <TheProductsCategoryMenu
              :categories="productCategories as unknown as ProductCategory[]"
            />
          </v-menu>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                class="menu-link"
                variant="text"
                v-bind="props"
                size="small"
                >Marki</v-btn
              >
            </template>
            <TheProductsCategoryMenu
              :categories="brands.product_categories as unknown as ProductCategory[]"
            />
          </v-menu>
          <v-btn
            class="menu-link"
            variant="text"
            :to="`/nowosci`"
            :active="false"
            size="small"
            >Nowości</v-btn
          >
          <v-btn
            class="menu-link"
            variant="text"
            :to="`/kody-rabatowe`"
            :active="false"
            size="small"
            >Kody rabatowe</v-btn
          >
          <v-btn
            class="menu-link"
            variant="text"
            :to="`/kontakt`"
            :active="false"
            size="small"
            >Kontakt</v-btn
          >
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 80px;
  background-color: #ffffff;
  @media only screen and (max-width: 1400px) {
    flex-direction: row;
  }

  .desktop-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1.5rem 2rem;
    background-color: #ffffff;
    .navbar-wrapper-top {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      padding: 1rem 2rem;
    }

    .logo {
      position: absolute;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      text-align: center;
      font-size: 3rem;
      font-family: "Great Vibes", cursive;
      //font-weight: bold;
    }

    .search-bar {
      flex: 1;
      max-width: 400px; /* Ograniczenie szerokości paska wyszukiwania */
      margin-left: auto; /* Przesunięcie paska wyszukiwania w prawo od logo */
    }

    .menu-action-buttons {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-left: 1rem;
    }

    .navbar-wrapper-bottom {
      display: flex;

      ul {
        display: flex;
        gap: 2rem;

        .menu-link {
          font-size: 1rem;
        }
      }
    }
  }

  .mobile-wrapper {
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    .hamburger-and-logo-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .logo {
        font-size: 2rem;
        font-family: "Great Vibes", cursive;
      }
    }
  }
}

.mobile-menu {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  //gap: 1rem;

  .mobile-menu-item {
    padding: 1.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.logo {
  color: $primary-color;
}
</style>
