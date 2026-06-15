# Agents Guidelines

## Framework & Architecture
- Framework: Angular 21 (Standalone architecture).
- Styling: TailwindCSS via `@tailwindcss/postcss`.
- Global styles: `src/styles.css`.
- Static assets: `public/` directory.

## Commands
- Use `npm` scripts for all tasks:
  - `npm start`: Run development server.
  - `npm run build`: Build the application.
  - `npm test`: Run tests.

## Project Quirks
- **Tests:** `angular.json` is configured with `"skipTests": true` for all schematics. `.spec.ts` files are not generated automatically. Agents must explicitly create test files if required.
