# Store visual direction

The store uses the existing Ego Hygiene site and theme system. A quiet editorial layout gives each design room to feel like part of a world: generous spacing, large titles, small monospaced labels, dark ink artwork studies, blush accents, and cyan details. Light, dark, and high-contrast themes remain available through the shared header.

## Current preview

- `/store` provides a searchable catalog of objects, designs, and collections. Search and type filters persist in URL query parameters, so back navigation and shared links retain the selection.
- `/store/products/:slug` shows the associated design, availability, related collections, and contextual stories.
- `/store/designs/:slug` lets a design exist independently of a product, song, or artist.
- `/store/collections/:slug` gathers explicitly connected products and designs, including the designs used by its products.
- Unknown slugs have a recovery link to the store. Empty collections and search results have explicit empty states.

The abstract SVG studies are UI placeholders, not final merch designs, garment mockups, print proofs, or artist releases. Each is labelled as concept artwork. Approved catalog images replace them automatically through the existing artwork schema; a failed image falls back to a labelled study. No stock imagery, third-party fonts, trackers, or image-generation services are required by these pages.

Catalog titles, descriptions, relationships, and purchase state come from the validated public catalog. There is no page-level product list to update. Presentational studies are chosen deterministically from each stable design ID and do not carry product configuration or manufacturing claims.

## Availability and ordering

Preview and unavailable objects show explanatory text with no checkout control. Only `getStorePurchaseAction` may produce a provider link for a validated live product. Variant choice and final price, tax, shipping, and returns remain with the hosted checkout. There is no cart or payment form in this storefront.

The homepage preview notice is present while no live products exist. Individual concept and availability labels remain meaningful if the catalog later mixes live and preview entries. Artist branding is descriptive future direction; fictional examples are not attributed to .play() or another real artist.

## Accessibility and page behavior

The pages use semantic headings, breadcrumbs, labelled search and filter controls, visible focus outlines, a polite search-result announcement, and responsive single- and multiple-column layouts. Motion is limited to a small hover treatment and disabled for reduced-motion preferences. The store uses the site theme tokens and provides explicit high-contrast overrides.

Each page sets its document title and existing description metadata in a React effect, restoring previous values on unmount. Metadata reflects the current entry. The app remains a client-rendered SPA; social preview crawlers that do not run JavaScript will need a later prerendering/deployment solution.

These are implementation choices for the mock store, not evidence of completed physical sampling, provider onboarding, checkout testing, or production release.
