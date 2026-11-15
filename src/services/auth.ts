/**
 * Authentication seam — DEMONSTRATION ONLY.
 *
 * Phase 1 has no real authentication. The UI never stores passwords or tokens.
 * Phase 2 requirements:
 *  - Server-side sessions or OAuth/OIDC via a vetted provider.
 *  - httpOnly, Secure, SameSite cookies; CSRF protection on mutations.
 *  - Rate limiting & lockout on login / password reset.
 *  - Admin routes protected by SERVER-SIDE role checks (proxy.ts + API),
 *    never by client-side flags.
 */
export const AUTH_IS_DEMO = true;
