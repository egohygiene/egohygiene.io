import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { Card, StatusBadge } from "@egohygiene/ui";

import { products } from "../content/products";
import { NotFoundPage } from "./NotFoundPage";

export function ProductPage() {
  const location = useLocation();
  const product = useMemo(
    () => products.find((item) => item.path === location.pathname),
    [location.pathname],
  );

  if (!product) {
    return <NotFoundPage />;
  }

  return (
    <Card>
      <h1>{product.name}</h1>
      <StatusBadge tone={product.status}>{product.status}</StatusBadge>
      <p>{product.description}</p>
      <p>
        This route reserves the future gateway path without pretending that a separate deployment
        exists yet.
      </p>
      <p>
        <Link to="/ecosystem">Back to the directory</Link>
      </p>
    </Card>
  );
}
