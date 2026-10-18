# eShop Admin Design System & Implementation Guide

This document defines the comprehensive design system and implementation standards extracted from the current project (`eShop Admin`). It serves as a standardized specification for replicating the exact aesthetic, architecture, and functional user experience in new projects.

---

## 1. Design Principles & Philosophy

- **Modern Enterprise Dashboard Aesthetics:** Clean, structured, and high-density layouts optimized for e-commerce management (products, orders, inventory, analytics).
- **Signal-First Reactive State:** Leveraging modern Angular (v20+) architecture with Signals (`signal()`, `computed()`) for lightning-fast, predictable UI state transitions.
- **Utility-First Styling:** Built with TailwindCSS v4 using `@tailwindcss/postcss`, adhering strictly to utility classes for consistent spacing, typography, and color harmony.
- **Visual Hierarchy & Clarity:** Clear distinction between headers, actionable buttons, form labels, and table data using gray-scale backgrounds with distinct primary brand accents.
- **Accessibility & Feedback:** High-contrast text, smooth transitions (200ms duration), interactive state indicators (hover, active, disabled, loading skeletons/spinners, toast alerts), and confirmation modals for destructive actions.

---

## 2. Visual Identity System

### A. Color Palette
The system utilizes Tailwind's built-in neutral grays combined with **Indigo** as the primary interactive brand color and semantic status colors.

| Palette Category | Color Role | Tailwind Class / HEX | RGB / Description |
| :--- | :--- | :--- | :--- |
| **Primary / Brand** | Primary Action & Active State | `indigo-600` (`#4f46e5`) / `indigo-700` (`#4338ca`) | Main buttons, active sidebar items, focus rings |
| **Primary Light** | Hover & Active Backgrounds | `indigo-50` (`#eef2ff`) | Sidebar active background, subtle highlights |
| **Neutral Background** | App Shell Background | `gray-50` (`#f9fafb`) | Main content wrapper background |
| **Neutral Surface** | Cards, Modals, Tables | `white` (`#ffffff`) | Card containers, dropdowns, table headers/rows |
| **Neutral Borders** | Dividers & Inputs | `gray-200` (`#e5e7eb`) / `gray-300` (`#d1d5db`) | Input borders, card dividers, table borders |
| **Text Primary** | Main Headings & Titles | `gray-900` (`#111827`) | Page headers, table row text, primary labels |
| **Text Secondary** | Subtitles & Descriptions | `gray-500` (`#6b7280`) / `gray-600` (`#4b5563`) | Descriptions, table headers, metadata |
| **Semantic Success** | Published / Active / Stock High | `green-600` (`#16a34a`) / `green-50` (`#f0fdf4`) | Positive badges, stock indicators, success toasts |
| **Semantic Warning** | Featured / Pending | `yellow-500` (`#eab308`) / `amber-50` (`#fffbeb`) | Warnings, featured icons, pending states |
| **Semantic Danger** | Delete / Error / Out of Stock | `red-600` (`#dc2626`) / `red-50` (`#fef2f2`) | Delete actions, error banners, danger buttons |

---

### B. Typography
- **Font Family:** `Inter`, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif.
- **Smoothing:** Antialiased (`-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`).

| Type Scale | Size / Leading | Weight | Tailwind Classes | Usage Example |
| :--- | :--- | :--- | :--- | :--- |
| **Page Heading (H1)** | 24px / 32px | Bold (700) | `text-2xl font-bold text-gray-900` | Dashboard, Product List titles |
| **Section Heading (H2)** | 18px / 28px | Semi-bold (600) | `text-lg font-semibold text-gray-900` | Card headers, Form sections |
| **Modal Heading (H3)** | 20px / 28px | Semi-bold (600) | `text-xl font-semibold text-gray-900` | Confirmation dialog titles |
| **Body Text** | 14px / 20px | Regular / Medium | `text-sm text-gray-700` | Table cell text, form labels, descriptions |
| **Subtext / Caption** | 12px / 16px | Regular / Medium | `text-xs text-gray-500` | Table headers, badges, timestamps |

---

### C. Iconography
- **Source:** Heroicons (Outline & Solid variants, 24x24 viewBox, stroke-width: 2).
- **Dimensions:** Standard UI icons: `w-5 h-5` (navigation, buttons); Small icons: `w-4 h-4` (search, table actions); Large icons: `w-6 h-6` (stat cards, modals).

---

## 3. UI Component Library

### A. Buttons
- **Primary Button:**
  - Classes: `inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`
- **Secondary / Outline Button:**
  - Classes: `inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors`
- **Danger / Delete Button:**
  - Classes: `px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 active:scale-95 transition-all duration-150 shadow-sm shadow-red-100`
- **Action Icon Button:**
  - Classes: `p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors`

---

### B. Form Inputs & Controls
- **Text / Number Input:**
  - Classes: `w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`
  - Error State: Add `border-red-400` or `border-red-500`.
- **Select Dropdown:**
  - Classes: `w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500`
- **Toggle Switch:**
  - Container: `relative inline-flex items-center h-5 w-9 rounded-full transition-colors focus:outline-none` (`bg-green-500` when active, `bg-gray-300` when inactive).
  - Knob: `inline-block h-4 w-4 transform bg-white rounded-full transition-transform` (`translate-x-4` when active, `translate-x-0` when inactive).
- **Checkbox:**
  - Classes: `w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500`

---

### C. Cards & Containers
- **Standard Card Container:**
  - Classes: `bg-white rounded-xl border border-gray-200 p-6` (hover effect: `hover:shadow-md transition-shadow`).
- **Stat Metric Card:**
  - Layout: Flex row with icon box (`w-12 h-12 rounded-xl flex items-center justify-center`) and text stack (`text-sm font-medium text-gray-500`, `text-2xl font-bold text-gray-900 mt-1`).

---

### D. Data Tables
- **Table Wrapper:** `bg-white rounded-xl border border-gray-200 overflow-x-auto`
- **Table Header (`<thead>`):** `bg-gray-50 border-b border-gray-200`
- **Header Cells (`<th>`):** `text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3`
- **Table Body Rows (`<tr>`):** `hover:bg-gray-50 transition-colors` with divider `divide-y divide-gray-100` on tbody.
- **Table Cells (`<td>`):** `px-6 py-4 text-sm text-gray-700`

---

### E. Modals & Dialogs
- **Backdrop:** `fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm transition-opacity`
- **Dialog Box:** `relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden transform transition-all`

---

## 4. Layout & Grid Systems

- **Breakpoints:**
  - `sm`: 640px
  - `md`: 768px (Sidebar transition boundary)
  - `lg`: 1024px (Multi-column dashboard & grid layouts)
  - `xl`: 1280px
- **App Shell Structure:**
  - Fixed Sidebar: `fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40` (`w-64` expanded, `w-16` collapsed).
  - Main Content Area: `flex-1 transition-all duration-300` with responsive margins (`md:ml-64` or `md:ml-16`).
  - Sticky Top Navbar: `sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6`.
  - Main Container Padding: `p-4 md:p-6`.

---

## 5. Design Tokens (Summary)

```json
{
  "colors": {
    "primary": { "600": "#4f46e5", "700": "#4338ca", "50": "#eef2ff" },
    "neutral": { "50": "#f9fafb", "100": "#f3f4f6", "200": "#e5e7eb", "300": "#d1d5db", "500": "#6b7280", "900": "#111827" },
    "success": { "600": "#16a34a", "50": "#f0fdf4" },
    "warning": { "500": "#eab308", "50": "#fffbeb" },
    "danger": { "600": "#dc2626", "50": "#fef2f2" }
  },
  "spacing": {
    "sidebar-expanded": "16rem",
    "sidebar-collapsed": "4rem",
    "header-height": "4rem"
  },
  "borderRadius": {
    "sm": "0.375rem",
    "DEFAULT": "0.5rem",
    "lg": "0.75rem",
    "xl": "1rem",
    "2xl": "1rem"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "DEFAULT": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
  }
}
```

---

## 6. Interaction & Motion Guidelines

- **Transitions & Timing:** Standard interactive state transitions use `transition-colors duration-200` or `transition-all duration-300` for layout collapses.
- **Active / Hover Feedback:** Buttons and interactive cards feature subtle background shifts (`hover:bg-gray-100`, `hover:bg-indigo-700`) and scale feedback (`active:scale-95`).
- **Feedback & Notifications:** Toast alerts (using `ngx-toastr`) styled with border-left color accents (success green, error red, info blue, warning yellow) and a 1-pixel bottom progress bar.
