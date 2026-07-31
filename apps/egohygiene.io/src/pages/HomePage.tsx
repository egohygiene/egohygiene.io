import { Link } from "react-router-dom";

import { Icon } from "@egohygiene/icons";
import { Card, Cluster, LinkButton, PageSection, Stack, StatusBadge } from "@egohygiene/ui";

import { products } from "../content/products";

const pillars = ["self-awareness", "empathy", "growth", "balance"];

export function HomePage() {
  return (
    <Stack>
      <PageSection className="site-hero">
        <p className="site-eyebrow">Ego Hygiene</p>
        <h1>Tools, ideas, and practices for moving toward balance and harmony.</h1>
        <p>
          A calm first release for people building more awareness, more compassion, and more
          thoughtful creative and engineering tools.
        </p>
        <Cluster>
          <LinkButton href="/ecosystem">Explore the ecosystem</LinkButton>
          <LinkButton href="/about" tone="ghost">
            Learn what Ego Hygiene means
          </LinkButton>
        </Cluster>
      </PageSection>
      <PageSection>
        <h2>Pillars</h2>
        <div className="site-grid">
          {pillars.map((pillar) => (
            <Card key={pillar}>
              <h3>{pillar}</h3>
              <p>Practical, reflective language for everyday growth without inflated claims.</p>
            </Card>
          ))}
        </div>
      </PageSection>
      <PageSection>
        <h2>Ecosystem preview</h2>
        <div className="site-grid">
          {products.slice(0, 6).map((product) => (
            <Card key={product.identifier}>
              <Cluster className="site-card-header">
                <strong>{product.name}</strong>
                <StatusBadge tone={product.status}>{product.status}</StatusBadge>
              </Cluster>
              <p>{product.description}</p>
              <Link to={product.path}>View status</Link>
            </Card>
          ))}
        </div>
      </PageSection>
      <PageSection>
        <h2>Philosophy</h2>
        <p>
          Awareness helps us notice our patterns. Balance helps us respond with steadiness.
          Compassion keeps technology humane. Creativity helps the work feel alive.
        </p>
      </PageSection>
      <PageSection>
        <Card>
          <Cluster>
            <Icon decorative name="sparkles" />
            <div>
              <h2>Keep exploring</h2>
              <p>
                No account, no email capture, no backend required — just a clear starting point.
              </p>
            </div>
          </Cluster>
        </Card>
      </PageSection>
    </Stack>
  );
}
