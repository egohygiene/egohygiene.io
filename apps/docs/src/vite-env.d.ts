/// <reference types="vite/client" />

declare module "*.mdx?raw" {
  const value: string;
  export default value;
}
