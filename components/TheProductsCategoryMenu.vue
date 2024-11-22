<script setup lang="ts">
import type { ProductCategory } from "@medusajs/client-types";

const props = defineProps<{
  categories: ProductCategory[];
}>();

const mainCategories = props.categories[0].category_children;
</script>

<template>
  <v-list class="the-products-category-menu-list">
    <template v-for="category in mainCategories" :key="category.id">
      <!-- Kategorie z podkategoriami -->
      <v-menu
        v-if="category.category_children?.length"
        offset-x
        open-on-hover
        submenu
      >
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :to="`/kategoria/${category.handle}`">
            <v-list-item-title>{{ category.name }} </v-list-item-title>
            <template v-slot:append>
              <v-icon icon="mdi-menu-right" size="x-small"></v-icon>
            </template>
          </v-list-item>
        </template>

        <v-list>
          <v-list-item
            v-for="subCategory in category.category_children"
            :key="subCategory.id"
            :value="subCategory.handle"
            :to="`/kategoria/${subCategory.handle}`"
            link
          >
            <v-list-item-title>{{ subCategory.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Kategorie bez podkategorii -->
      <v-list-item
        v-else
        :value="category.handle"
        :to="`/kategoria/${category.handle}`"
        link
      >
        <v-list-item-title>{{ category.name }}</v-list-item-title>
      </v-list-item>
    </template>
  </v-list>
</template>

<style lang="scss" scoped>
//.the-products-category-menu-list {
//   /* Ustawienie szerokości na automatyczne dopasowanie */
//   width: auto;

//   .v-menu__content {
//     /* Minimalna szerokość na auto, aby elementy były odpowiednio szerokie */
//     min-width: auto !important;
//   }

//   .v-list-item {
//     /* Zapewnienie elastycznego dopasowania szerokości */
//     width: auto;
//     max-width: none;
//   }
// }
</style>
