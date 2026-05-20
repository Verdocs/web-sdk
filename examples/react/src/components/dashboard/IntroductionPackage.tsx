import React, { Dispatch, SetStateAction } from "react";

interface IntroductionPackageProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const IntroductionPackage: React.FC<IntroductionPackageProps> = (props) => {
  const { setModalOpen } = props;

  return (
    <aside className="dashboard-cta">
      <div className="dashboard-cta-copy">
        <h2 className="dashboard-cta-title">Get the Introduction Package</h2>
        <p className="dashboard-cta-subline">Source code, docs, and a guided walkthrough—delivered for free.</p>
      </div>
      <button type="button" className="dashboard-cta-button" onClick={() => setModalOpen(true)}>
        Request Introduction Package
      </button>
    </aside>
  );
};
