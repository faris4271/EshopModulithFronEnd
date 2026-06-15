# Esop Admin Dashboard

A modern administrative dashboard for managing an E-shop, built with Angular 21 and TailwindCSS.

## 🚀 Tech Stack

- **Framework:** [Angular 21](https://angular.dev/) (Standalone Architecture)
- **Styling:** [TailwindCSS](https://tailwindcss.com/) (via `@tailwindcss/postcss`)
- **Notifications:** [ngx-toastr](https://www.npmjs.com/package/ngx-toastr)
- **Package Manager:** npm

## 🛠️ Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Esop_Admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Run the development server:
```bash
npm start
```
The application will be available at `http://localhost:4200/`.

### Building for Production
```bash
npm run build
```

## 🏗️ Architecture & Key Features

### Standalone Components
The project utilizes Angular's standalone architecture, removing the need for `NgModule` and simplifying the component dependency graph.

### Global Error Handling
Implemented a centralized error handling system using a custom `HttpInterceptor` and `ToastService`:
- **`ToastService`**: A wrapper around `ngx-toastr` for consistent notification calls throughout the app.
- **`errorInterceptor`**: Automatically catches all HTTP errors and displays a user-friendly toast notification, reducing redundant error handling in individual components.

### Styling
Integrated TailwindCSS for rapid UI development with a utility-first approach. Global styles are managed in `src/styles.css`.

## 📁 Project Structure
- `src/app/pages`: Feature-based page components.
- `src/app/services`: Business logic and API integration services.
- `src/app/interceptors`: HTTP interceptors for global request/response handling.
- `src/app/models`: TypeScript interfaces and DTOs.
- `public/`: Static assets.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Starts the development server |
| `npm run build` | Builds the project for production |
| `npm test` | Runs unit tests |
