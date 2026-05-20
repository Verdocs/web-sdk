import { NavLink } from "react-router-dom";

const NAV_ITEMS: { path: string; label: string }[] = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/build", label: "Build" },
  { path: "/sign", label: "Sign" },
];

interface NavTagsProps {}

const NavTags = (_props: NavTagsProps) => {
  return (
    <header className="app-header">
      <nav className="app-nav" aria-label="Example pages">
        {NAV_ITEMS.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `app-nav-link ${isActive ? "app-nav-link--active" : ""}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default NavTags;
