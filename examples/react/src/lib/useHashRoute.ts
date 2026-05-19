import { useEffect, useState } from "react";

export type AppRoute = "build" | "sign" | "dashboard";

const parseHash = (hash: string): AppRoute => {
  if (hash === "#/sign" || hash.startsWith("#/sign?")) {
    return "sign";
  }
  if (hash === "#/build" || hash.startsWith("#/build?")) {
    return "build";
  }
  return "dashboard";
};

export const useHashRoute = (): AppRoute => {
  const [route, setRoute] = useState<AppRoute>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route;
};

export const navigateToRoute = (route: AppRoute): void => {
  window.location.hash = route === "sign" ? "#/sign" : route === "build" ? "#/build" : "#/dashboard";
};
