<script setup lang="ts">
const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["closeMenu"]);

const isOpen = ref<boolean>(false);

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
};

const hasChildren = computed(() => {
  return (
    props.category.category_children &&
    props.category.category_children.length > 0
  );
});
</script>

<template>
  <li>
    <div class="d-flex align-center">
      <v-btn
        :to="`/kategoria/${category.handle}`"
        variant="text"
        @click="emit('closeMenu')"
        >{{ category.name }}</v-btn
      >
      <v-btn
        v-if="hasChildren"
        variant="text"
        icon="mdi-chevron-down"
        @click="toggleOpen"
      ></v-btn>
    </div>

    <v-expand-transition>
      <ul v-show="isOpen" class="nested-categories">
        <MobileCategoryItem
          v-for="child in category.category_children"
          :key="child.id"
          :category="child"
          @closeMenu="emit('closeMenu')"
        />
      </ul>
    </v-expand-transition>
  </li>
</template>

<style lang="scss" scoped>
.nested-categories {
  padding-left: 16px;
}
</style>
