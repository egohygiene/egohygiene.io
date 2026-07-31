import { Card, Cluster, StatusBadge } from "@egohygiene/ui";

import { products } from "../content/products";

export function EcosystemPage() {
  return (
    <article className="site-stack">
      <header className="site-prose">
        <h1>The Ego Hygiene ecosystem</h1>
        <p>
          A typed product registry keeps the current platform honest while preparing the root site
          to become a gateway later.
        </p>
      </header>
      <div className="site-grid">
        {products.map((product) => (
          <Card key={product.identifier}>
            <Cluster className="site-card-header">
              <h2>{product.name}</h2>
              <StatusBadge tone={product.status}>{product.status}</StatusBadge>
            </Cluster>
            <p>{product.description}</p>
            <dl>
              <div>
                <dt>Category</dt>
                <dd>{product.category}</dd>
              </div>
              <div>
                <dt>Path</dt>
                <dd>{product.path}</dd>
              </div>
            </dl>
            {product.repositoryUrl ? (
              <p>
                <a href={product.repositoryUrl}>Repository</a>
              </p>
            ) : null}
          </Card>
        ))}
      </div>
    </article>
  );
}
