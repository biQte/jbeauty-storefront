<script setup lang="ts">
import { mergeProps } from "vue";
import type { ProductCategory } from "@medusajs/client-types";
import { useWindowSize } from "@vueuse/core";

const loading = ref<boolean>(false);

const cartStore = useCartStore();

const productCategories = ref();
const brands = ref();
// const recommendedBy = ref();

const nuxtApp = useNuxtApp();
const mobileMenu = ref<boolean>(false);
const previousScrollY = ref(0);
const scrollStrategy = ref<"block" | "close" | "none" | "reposition">("block");

const config = useRuntimeConfig();
const { width, height } = useWindowSize({
  initialWidth: 390,
  initialHeight: 550,
});

const results = await Promise.allSettled([
  useFetch(`/api/categories/${config.public.productsCategoryID}`, {
    server: true,
    credentials: "include",
  }),
  useFetch(`/api/categories/${config.public.brandsCategoryID}`, {
    server: true,
    credentials: "include",
  }),
]);

// const { data: pcats } = await useFetch(
//   `/api/categories/${config.public.productsCategoryID}`,
//   { server: true }
// );

// const { data: bcats } = await useFetch(
//   `/api/categories/${config.public.brandsCategoryID}`,
//   {
//     server: true,
//   }
// );

if (results[0].status === "fulfilled") {
  productCategories.value = results[0].value.data.value;
}

if (results[1].status === "fulfilled") {
  brands.value = results[1].value.data.value;
}

// const { data: recommendedByCategories } = await useFetch(
//   `/api/categories/${config.public.recommendedByCategoryID}`,
//   {
//     server: true,
//   }
// );

// watchEffect(() => {
//   if (pcats.value) productCategories.value = pcats.value;
//   if (bcats.value) brands.value = bcats.value;
//   // if (recommendedByCategories.value) recommendedBy.value = recommendedByCategories.value;
// });

// const productCategoryMenuOpen = ref<boolean>(false);
// const brandCategoryMenuOpen = ref<boolean>(false);
// const toggleProductCategoryMenu = () => {
//   productCategoryMenuOpen.value = !productCategoryMenuOpen.value;
// };
// const toggleBrandCategoryMenu = () => {
//   brandCategoryMenuOpen.value = !brandCategoryMenuOpen.value;
// };

// watch(mobileMenu, (newValue) => {
//   if (newValue === false) {
//     productCategoryMenuOpen.value = false;
//     brandCategoryMenuOpen.value = false;
//   }
// });

const closeMenu = () => {
  mobileMenu.value = false;
};

const cartId = useCookie("cart_id");

watch(mobileMenu, (open) => {
  if (open) {
    previousScrollY.value = window.scrollY;

    if(window.scrollY > 0) {
    // Scroll to top, ale tylko jeśli nie jesteśmy już na górze
        window.scrollTo({
          top: 0,
          // behavior: "smooth",
          behavior: "instant"
        });

        scrollStrategy.value = "block";

      }
  } else {
    // Przywróć poprzedni scroll
    scrollStrategy.value = "none";

      window.scrollTo({
        top: previousScrollY.value,
        // behavior: "smooth",
        behavior: "instant"
      });

  }
});

onMounted(async () => {
  if (!cartStore.cartObject && cartId !== null) {
    cartStore.fetchCart();
  }
});
</script>

<template>
  <div class="navbar-wrapper">
    <div class="mobile-wrapper" v-show="width <= 1440">
      <div class="hamburger-and-logo-wrapper">
        <v-menu
          v-model="mobileMenu"
          location="start"
          eager
          :scroll-strategy="scrollStrategy"
          :width="100 + '%'"
          :height="100 + '%'"
          attach="body"
          location-strategy="static"
          scrim="#FFFFFF"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ props }">
            <v-btn variant="text" icon="mdi-menu" v-bind="props"></v-btn>
          </template>
          <v-card min-width="350px" :width="width" class="menu-card">
            <v-btn
              icon="mdi-close"
              variant="text"
              @click="mobileMenu = false"
            ></v-btn>
            <ul class="mobile-menu">
              <v-btn
                to="/"
                @click="closeMenu"
                class="mobile-menu-item"
                variant="text"
                >Strona główna</v-btn
              >
              <ul class="product-categories">
                <TheNavbarMobileCategoryItem
                  :category="productCategories[0]"
                  @close-menu="closeMenu"
                />
              </ul>
              <ul class="product-categories">
                <TheNavbarMobileCategoryItem
                  :category="brands[0]"
                  @close-menu="closeMenu"
                />
              </ul>
              <v-btn
                to="/nowosci"
                @click="closeMenu"
                class="mobile-menu-item"
                variant="text"
                >Nowości</v-btn
              >
              <!-- <ul class="product-categories">
                <TheNavbarMobileCategoryItemWithPhoto
                  :category="recommendedBy[0]"
                  @close-menu="closeMenu"
                />
              </ul> -->
              <v-btn
                to="/wyprzedaz"
                @click="closeMenu"
                class="mobile-menu-item"
                variant="text"
                >Wyprzedaż</v-btn
              >
              <v-btn
                :to="`/promocje`"
                @click="closeMenu"
                class="mobile-menu-item"
                variant="text"
              >
                Promocje
              </v-btn>
              <v-btn
                to="/blog"
                @click="closeMenu"
                class="mobile-menu-item"
                variant="text"
                >Blog</v-btn
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
    <div class="desktop-wrapper" v-show="width > 1440">
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
              :categories="brands as unknown as ProductCategory[]"
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
            :to="`/wyprzedaz`"
            :active="false"
            size="small"
            >Wyprzedaż</v-btn
          >
          <v-btn
            class="menu-link"
            variant="text"
            :to="`/promocje`"
            :active="false"
            size="small"
            >Promocje</v-btn
          >
          <!--<v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                class="menu-link"
                variant="text"
                v-bind="props"
                size="small"
                >Polecane przez</v-btn
              >
            </template>
            <ProductCategoryMenuWithIcons
              :categories="recommendedBy as unknown as ProductCategory[]"
            />
          </v-menu>-->
          <!--<v-btn
            class="menu-link"
            variant="text"
            :to="`/kody-rabatowe`"
            :active="false"
            size="small"
            >Kody rabatowe</v-btn
          >-->
          <v-btn
            class="menu-link"
            variant="text"
            to="/blog"
            :active="false"
            size="small"
            >Blog</v-btn
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
      min-height: 80px;
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
    min-height: 80px;
    .hamburger-and-logo-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .logo {
        padding-left: 15px;
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
  color: $logo-color;
}
</style>
