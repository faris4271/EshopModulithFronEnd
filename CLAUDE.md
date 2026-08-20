# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This repository is an **Angular 21 Admin Dashboard** for an e-commerce platform ("EshopModulith"). It is built using:
- **Standalone Components** (no `NgModule`).
- **TailwindCSS** for styling.
- **TypeScript** with strong type definitions.
- **Global Error Handling** and **Toast Notifications**.

## Development Commands
- **Start Development**: `npm start` (Runs the dev server at http://localhost:4200).
- **Build**: `npm run build` (Produces optimized bundles in `dist/`).
- **Tests**: `npm test` (Runs unit tests).
- **Generate Components**: Use `ng generate component ...` (The CLI defaults to standalone components).

## Architecture & Conventions
- **Component Pattern**: Use standalone components exclusively. Keep components clean (under 300 lines) and extract logic into services.
- **Services & API**: API calls live in `src/app/services/`. Models/interfaces are in `src/app/models/`.
- **State/Communication**: Use `signal` for state management and `RxJS` (Observables/async pipe) for data streams.
- **HTTP/API**: 
  - API Base URL is environment-specific (see `src/environments/`).
  - API communication is typed using interfaces in `src/app/models/`.
  - HTTP Interceptors (`src/app/interceptors/`) manage JWT auth injection and global error handling.
- **Styling**: All styling should be done with TailwindCSS utility classes directly in the component HTML templates.

## Workflow Tips
- Always prefer creating services for business logic rather than putting it in components.
- When creating new features, follow the existing page structure: `src/app/pages/<feature-name>/`.
- Use the `ToastService` for user-facing feedback and error notifications.
- API requests should be properly typed using the existing model interfaces.
