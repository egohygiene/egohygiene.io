import { productCategorySchema, productStatusSchema } from "@egohygiene/schemas";

export interface EcosystemProduct {
  readonly identifier: string;
  readonly name: string;
  readonly description: string;
  readonly status: "available" | "development" | "planned";
  readonly category: "knowledge" | "engineering" | "creative" | "platform" | "commerce";
  readonly path: string;
  readonly repositoryUrl?: string;
}

const rawProducts = [
  {
    identifier: "mindcap",
    name: "Mindcap",
    description: "A practical reflection space for capturing moments of insight.",
    status: "development",
    category: "knowledge",
    path: "/mindcap",
    repositoryUrl: "https://github.com/egohygiene/mindcap",
  },
  {
    identifier: "mindgarden",
    name: "Mindgarden",
    description: "A calm place to connect ideas, notes, and personal frameworks.",
    status: "planned",
    category: "knowledge",
    path: "/mindgarden",
  },
  {
    identifier: "renderflow",
    name: "Renderflow",
    description: "Creative tooling for motion, graphics, and visual communication.",
    status: "planned",
    category: "creative",
    path: "/renderflow",
  },
  {
    identifier: "egolint",
    name: "Egolint",
    description: "Engineering checks for reflective, humane, maintainable systems.",
    status: "development",
    category: "engineering",
    path: "/egolint",
    repositoryUrl: "https://github.com/egohygiene/egolint",
  },
  {
    identifier: "reflector",
    name: "Reflector",
    description: "Prompts and guided practices for honest self-observation.",
    status: "planned",
    category: "platform",
    path: "/reflector",
  },
  {
    identifier: "aether",
    name: "Aether",
    description: "Infrastructure patterns for shared themes, content, and product gateways.",
    status: "development",
    category: "platform",
    path: "/aether",
  },
  {
    identifier: "store",
    name: "Store",
    description: "Future commerce surfaces for thoughtfully curated digital goods.",
    status: "planned",
    category: "commerce",
    path: "/store",
  },
] satisfies EcosystemProduct[];

export const products = rawProducts.map((product) => ({
  ...product,
  status: productStatusSchema.parse(product.status),
  category: productCategorySchema.parse(product.category),
}));
