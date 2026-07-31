# System overview

The repository is a small pnpm workspace organized around three applications and a handful of shared packages.

## Dependency direction

- applications depend on packages
- product packages depend on foundational packages
- foundational packages depend on tokens and utilities

## Implemented slice

- public website
- docs app
- playground app
- shared UI, themes, tokens, i18n, config, content, API client, utilities, icons, and visualization primitives
