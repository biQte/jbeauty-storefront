import type { Customer } from "@medusajs/client-types";
import type { CustomerTypes } from "@medusajs/types";
import type { CustomerDTO } from "@medusajs/types";

export const useSessionStore = defineStore("session", () => {
  const nuxtApp = useNuxtApp();
  const config = useRuntimeConfig();

  const session = ref<CustomerDTO | null>(null);
  const triedToFetchSession = ref<boolean>(false);

  const isAuthenticated = computed(() => {
    return session.value !== null && session.value?.has_account;
  });

  const fetchSession = async () => {
    if (triedToFetchSession.value) {
      return;
    }

    triedToFetchSession.value = true;
    const event = nuxtApp.ssrContext?.event;

    try {
      const customer = await $fetch(
        `${config.public.storeUrl}/api/customers/me`,
        {
          credentials: "include",
          method: "GET",
          // @ts-expect-error
          headers: {
            Cookie: import.meta.server
              ? event?.node.req.headers.cookie
              : undefined,
          },
        }
      );

      session.value = customer as unknown as CustomerDTO;
    } catch (e) {
      session.value = null;
    }
  };

  const deleteSession = async () => {
    session.value = null;
  };

  return {
    session,
    fetchSession,
    deleteSession,
    isAuthenticated,
    triedToFetchSession,
  };
});
