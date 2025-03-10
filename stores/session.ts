import type { Customer } from "@medusajs/client-types";
import type { CustomerTypes } from "@medusajs/types";
import type { CustomerDTO } from "@medusajs/types";

export const useSessionStore = defineStore("session", () => {
  const nuxtApp = useNuxtApp();
  const config = useRuntimeConfig();
  const session = ref<undefined | CustomerDTO>(undefined);
  const triedToFetchSession = ref<boolean>(false);

  const isAuthenticated = computed(() => !!session.value?.has_account);

  const fetchSession = async () => {
    try {
      const { customer } = await $fetch(`/api/customers/me`, {
        credentials: "include",
        method: "GET",
      });

      session.value = customer as unknown as CustomerDTO;

      triedToFetchSession.value = true;
    } catch (e) {
      return;
    }
  };

  const deleteSession = async () => {
    // localStorage.removeItem("cart_id");
    session.value = undefined;
  };

  return {
    session,
    fetchSession,
    deleteSession,
    isAuthenticated,
    triedToFetchSession,
  };
});
