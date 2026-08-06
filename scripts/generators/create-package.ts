const name = process.argv[2];

if (!name) {
  throw new Error(
    "Usage: node --experimental-strip-types scripts/generators/create-package.ts <name>",
  );
}

console.log(
  `Create a new package at packages/${name} using the existing workspace package manifest pattern.`,
);
