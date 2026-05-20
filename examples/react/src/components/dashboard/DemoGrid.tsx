import React from "react";
import { DemoCard } from "./DemoCard";

interface DemoGridProps {}

export const DemoGrid: React.FC<DemoGridProps> = () => {
  return (
    <div className="dashboard-demo-grid">
      <DemoCard
        title="Build a template"
        description="Create documents, add signers, and send."
        ctaLabel="Try Build"
        to="/build"
      />
      <DemoCard
        title="Sign an envelope"
        description="Walk through what your end users see when they sign."
        ctaLabel="Try Sign"
        to="/sign"
      />
    </div>
  );
};
