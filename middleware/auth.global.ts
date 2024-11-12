import { ROUTES } from "../constants/routes";

export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp();
  const sessionStore = useSessionStore(nuxtApp.$pinia);
  if (!sessionStore.triedToFetchSession) {
    await sessionStore.fetchSession();
  }
  if (sessionStore.isAuthenticated) {
    if (to.meta.isAccessibleAfterLogin === false) {
      return navigateTo(ROUTES.ROOT_PAGE);
    }
  }
  if (to.path === ROUTES.ACCOUNT_PAGE && !sessionStore.isAuthenticated) {
    return navigateTo(ROUTES.LOGIN_PAGE);
  }
});
