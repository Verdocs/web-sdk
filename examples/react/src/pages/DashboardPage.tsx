import { useState } from "react";
import NavTags from "../components/navTags/NavTags";
import { IntroductionPackageModal } from "../components/dashboard/IntroductionPackageModal";
import { navigateToRoute } from "../lib/useHashRoute";

interface DemoCardProps {
  title: string;
  description: string;
  ctaLabel: string;
  route: "build" | "sign";
}

const DemoCard = ({ title, description, ctaLabel, route }: DemoCardProps) => (
  <article className="dashboard-demo-card">
    <h3 className="dashboard-demo-card-title">{title}</h3>
    <p className="dashboard-demo-card-description">{description}</p>
    <a
      href={`#/${route}`}
      className="dashboard-demo-card-link"
      onClick={(e) => {
        e.preventDefault();
        navigateToRoute(route);
      }}
    >
      {ctaLabel} →
    </a>
  </article>
);

export const DashboardPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="dashboard-page">
      <NavTags />

      <header className="dashboard-hero">
        <p className="dashboard-eyebrow">Interactive demo</p>
        <h1 className="dashboard-headline">See how agreements flow inside your product</h1>
        <p className="dashboard-subline">
          Explore two live experiences—building a template and completing a signature—without a technical setup.
        </p>
      </header>

      <div className="dashboard-demo-grid">
        <DemoCard
          title="Build a template"
          description="Create documents, add signers, and send."
          ctaLabel="Try Build"
          route="build"
        />
        <DemoCard
          title="Sign an envelope"
          description="Walk through what your end users see when they sign."
          ctaLabel="Try Sign"
          route="sign"
        />
      </div>

      <aside className="dashboard-cta">
        <div className="dashboard-cta-copy">
          <h2 className="dashboard-cta-title">Get the Introduction Package</h2>
          <p className="dashboard-cta-subline">
            Source code, docs, and a guided walkthrough—delivered after a quick intro.
          </p>
        </div>
        <button type="button" className="dashboard-cta-button" onClick={() => setModalOpen(true)}>
          Request Introduction Package
        </button>
      </aside>

      <IntroductionPackageModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
