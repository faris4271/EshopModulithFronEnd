# Shared Authentication Library Plan

## Goal

Create a reusable Angular authentication library for the two Angular applications in
`D:\vs\Eshop_Dashbord`:

- `Esop_Admin`: the existing e-commerce administration dashboard.
- `Eshop_FronEnd\Eshop_FrontEnd`: the customer-facing user interface.

The library will centralize authentication behavior while leaving application-specific
pages, navigation, permissions, and presentation in each application.

## Confirmed architectural decision

- Use a local Angular workspace library in the parent workspace, consumed by both
  applications.
- Reorganize the existing applications under one parent Angular workspace rather
  than connecting separate workspaces through ad-hoc TypeScript paths.
- Do not duplicate the authentication service, route guard, interceptor, or auth
  models in either application.
- Keep the library framework-compatible with Angular 21 and standalone APIs.
- Both applications use the same identity API contract and cookie domain.
- The first user-facing integration includes the full authentication flow:
  login, registration, session validation, profile loading, refresh, and logout.
- Preserve the originally requested protected URL through the login redirect when
  the user-facing experience supports it.

## Current state found

### Admin dashboard

- `src/app/services/auth-service.ts` currently owns:
  - login and registration requests;
  - logout and refresh-token requests;
  - profile loading;
  - signal-based authentication state;
  - application-startup auth initialization.
- `src/app/guards/auth-guard.ts` waits for initialization and redirects unauthenticated
  users to `/login`.
- `src/app/interceptors/refresh-token-interceptor.ts` adds credentials and retries
  failed requests after refreshing the token.
- `src/app/app.config.ts` registers the HTTP interceptors and runs the auth check as an
  application initializer.
- `src/app/pages/auth/` contains dashboard-specific login and registration screens.
- `src/app/layout/navbar.component.ts` and the profile page consume the current user
  state.

### User-facing application

- It has a copied `src/app/guards/auth-guard.ts`.
- It currently has no corresponding auth service, auth interceptor, auth models, or
  application initializer.
- Its routes currently expose only the product-search feature, so authentication
  integration will need to be added without assuming the dashboard's route structure.

## Proposed library responsibilities

Create a library package such as `shared-auth` with a small public API:

1. **Typed models**
   - Login credentials.
   - Registration request.
   - Login response.
   - Authenticated profile/user.
   - A typed auth configuration contract for API endpoint and public-route behavior.

2. **Authentication service**
   - `login()`.
   - `register()`.
   - `logout()`.
   - `refreshToken()`.
   - `checkAuthStatus()`.
   - Read-only auth state and current-user signals.
   - Explicit state reset on logout or failed refresh.
   - Typed HTTP responses and typed request inputs.

3. **Route guard**
   - Wait for the initial auth check to finish.
   - Allow authenticated navigation.
   - Return a configured login `UrlTree` for unauthenticated navigation.
   - Preserve the attempted URL when the application supports post-login return
     navigation.

4. **HTTP interceptor**
   - Apply `withCredentials` consistently to auth-protected requests.
   - Exclude login, registration, refresh, and logout endpoints from refresh loops.
   - Serialize concurrent refresh attempts.
   - Retry queued requests after a successful refresh.
   - Clear auth state and redirect through the configured router target after refresh
     failure.
   - Avoid handling a 401 from the refresh request as another refresh attempt.

5. **Angular provider**
   - Provide the service, guard support, interceptor, and startup initialization as
     one application-level configuration function.
   - Accept app-specific settings such as API base URL, login route, and endpoint
     paths.
   - Avoid coupling the library to dashboard-only services such as toastr, spinner,
     layout components, or admin route names.

## Implementation phases

### Phase 1: Workspace and library scaffolding

- Create or reorganize the parent Angular workspace while preserving the two existing
  application roots and their current build configurations.
- Generate the library with Angular CLI conventions.
- Add a public entry point and configure TypeScript/build paths.
- Define the initial library configuration and public exports.
- Ensure the library has no imports from either application's `src/app` tree.

### Phase 2: Extract and harden shared auth behavior

- Move the reusable models and auth service behavior from the dashboard into the
  library.
- Replace `any`-typed auth methods and responses with exported types.
- Consolidate auth state naming and expose read-only signals.
- Make the API URL and endpoint paths injectable configuration instead of importing
  the dashboard development environment directly.
- Preserve cookie-based authentication (`withCredentials`) and the existing
  identity API contract.
- Make initialization idempotent and ensure initialization completes on both success
  and failure.

### Phase 3: Extract guard and refresh interceptor

- Move the guard into the library and remove dashboard-only imports and unused
  dependencies.
- Move the refresh interceptor into the library.
- Use an injectable/configured redirect target rather than hard-coded `/login` where
  possible.
- Ensure all retry requests retain the original request options and credentials.
- Define behavior for requests made while a refresh is already in progress.
- Ensure failed refresh clears both authentication and current-user state.

### Phase 4: Integrate the admin dashboard

- Replace dashboard-local auth imports with the library public API.
- Register the library provider in `app.config.ts`.
- Remove or retain only thin dashboard adapters where UI-specific behavior is needed.
- Update login, registration, navbar, profile, and route configuration to use the
  shared types and service.
- Preserve dashboard-specific toast messages, navigation, and layout behavior.
- Verify all existing protected dashboard routes continue to use the shared guard.

### Phase 5: Integrate the user-facing UI

- Add the library dependency/path mapping to the user-facing application.
- Register the same auth provider with the user-facing API configuration.
- Replace the copied guard with the library guard.
- Add the user-facing login/register screens and route protection only where required
  by that application's UX.
- Add an application initializer and HTTP interceptor registration.
- Keep user-facing routes, redirects, and presentation independent from dashboard
  routes.

### Phase 6: Tests and documentation

- Add library unit tests for:
  - login success and failure state transitions;
  - logout state clearing;
  - startup auth initialization success and failure;
  - guard behavior before and after initialization;
  - login redirect behavior;
  - refresh serialization and queued request retry;
  - refresh failure handling;
  - endpoint exclusion from refresh logic.
- Add focused integration tests in both applications for provider registration and
  protected routes.
- Document installation/configuration, expected cookie/CORS requirements, endpoint
  contract, and migration usage in the library README.
- Build both applications and run the relevant test suites.

## Important design constraints

- The library must not import `environment.development.ts`; each application supplies
  its own API configuration.
- The library must not depend on dashboard-only `ngx-toastr`, spinner, layout, or
  page components.
- Authentication state must not be writable by consumers except through service
  operations or an explicitly documented internal mechanism.
- Error responses must remain observable to application error handling; the library
  must not silently convert failed requests into successful results.
- The refresh flow must prevent infinite loops and concurrent refresh races.
- Both applications must use compatible cookie, CORS, and credentials settings with
  the identity API.

## Validation checklist

- The library builds independently.
- The admin dashboard builds with the library and can:
  - initialize an existing session;
  - redirect unauthenticated users to login;
  - log in and navigate to its dashboard;
  - refresh an expired session;
  - log out and block protected routes.
- The user-facing UI builds with the library and has equivalent auth state and
  refresh behavior without dashboard-specific dependencies.
- No duplicate auth service, guard, or refresh interceptor remains in either app
  unless it is an intentional adapter with a documented reason.
- Existing non-auth HTTP behavior remains unchanged.

## Remaining implementation assumption

- Use `shared-auth` as the library name unless the parent workspace already has a
  naming convention that should take precedence.
