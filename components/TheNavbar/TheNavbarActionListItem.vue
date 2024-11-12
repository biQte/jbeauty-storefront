<script setup lang="ts">
import { mergeProps } from "vue";
import { ROUTES } from "../../constants/routes";

const router = useRouter();

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const handleClick = () => {
  if (props.title === "Koszyk") {
    router.push(ROUTES.CART_PAGE);
  } else if (props.title === "Konto") {
    router.push(ROUTES.ACCOUNT_PAGE);
  }
};
</script>

<template>
  <v-tooltip location="bottom">
    <template v-slot:activator="{ props: tooltip }">
      <v-btn
        v-bind="mergeProps(tooltip)"
        :icon="icon"
        variant="flat"
        @click="handleClick"
      ></v-btn>
    </template>
    <span>{{ title }}</span>
  </v-tooltip>
</template>

<style lang="scss" scoped></style>
