import { Link } from "react-router-dom";

interface DemoCardProps {
  title: string;
  description: string;
  ctaLabel: string;
  to: string;
}

export const DemoCard = (props: DemoCardProps) => {
  const { title, description, ctaLabel, to } = props;

  return (
    <article className="dashboard-demo-card">
      <h3 className="dashboard-demo-card-title">{title}</h3>
      <p className="dashboard-demo-card-description">{description}</p>
      <Link to={to} className="dashboard-demo-card-link">
        {ctaLabel} →
      </Link>
    </article>
  );
};
