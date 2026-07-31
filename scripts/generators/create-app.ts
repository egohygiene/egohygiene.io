const name = process.argv[2];

if (!name) {
  throw new Error("Usage: node --experimental-strip-types scripts/generators/create-app.ts <name>");
}

console.log(
  `Create a new app at apps/${name} by copying one of the existing minimal Vite applications.`,
);
