const name = process.argv[2];

if (!name) {
  throw new Error(
    "Usage: node --experimental-strip-types scripts/generators/create-component.ts <name>",
  );
}

console.log(`Create a new shared UI component named ${name} inside packages/ui/src/components.`);
