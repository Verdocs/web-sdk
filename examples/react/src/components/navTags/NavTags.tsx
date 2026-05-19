import React from "react";
import { AppRoute, navigateToRoute, useHashRoute } from "../../lib/useHashRoute";

const NAV_ITEMS: { route: AppRoute; label: string }[] = [
  { route: "dashboard", label: "Dashboard" },
  { route: "build", label: "Build" },
  { route: "sign", label: "Sign" },
];

interface NavTagsProps {}

const NavTags: React.FC<NavTagsProps> = () => {
  const route = useHashRoute();

  return (
    <header className="app-header">
      <nav className="app-nav" aria-label="Example pages">
        {NAV_ITEMS.map(({ route: navRoute, label }) => (
          <a
            key={navRoute}
            href={`#/${navRoute}`}
            className={`app-nav-link ${route === navRoute ? "app-nav-link--active" : ""}`}
            aria-current={route === navRoute ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              navigateToRoute(navRoute);
            }}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default NavTags;
