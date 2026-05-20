import React from "react";

interface DashboardHeaderProps {}

export const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  return (
    <header className="dashboard-hero">
      <h1 className="dashboard-headline">Walk through build and sign</h1>
      <p className="dashboard-subline">
        See how your team sets up templates and what signers see when they finish a document. Open the demos below when
        you&apos;re ready—no developer setup required.
      </p>
    </header>
  );
};
