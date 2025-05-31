import { ROUTES } from "../constants/routes";

export default defineNuxtRouteMiddleware(async (to) => {
  const sessionStore = useSessionStore();

  if (!sessionStore.triedToFetchSession) {
    await sessionStore.fetchSession();
  }

  if (
    sessionStore.isAuthenticated &&
    to.meta.isAccessibleAfterLogin === false
  ) {
    return navigateTo(ROUTES.ROOT_PAGE);
  }

  if (to.path.includes(ROUTES.ACCOUNT_PAGE) && !sessionStore.isAuthenticated) {
    return navigateTo(ROUTES.LOGIN_PAGE + `?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});
