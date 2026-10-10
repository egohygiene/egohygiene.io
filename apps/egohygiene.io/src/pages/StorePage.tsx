import { Link } from "react-router-dom";
import { storeCatalog } from "../content/store";

export function StorePage() {
  const products = storeCatalog.entries.filter((entry) => entry.kind === "product");
  return (
    <section className="site-prose" aria-labelledby="store-heading">
      <p className="site-eyebrow">Ego Hygiene · Store preview</p>
      <h1 id="store-heading">A home for the things we imagine.</h1>
      <p>Artwork, song worlds, and objects. The first {products.length} concepts are being prepared.</p>
      <p>These are previews. Purchases are not open yet.</p>
      <Link to="/">Return to Ego Hygiene</Link>
    </section>
  );
}
