import { betterAuth } from "better-auth";

const disabledSecret =
  "admin-auth-is-disabled-until-a-production-secret-is-configured";

export function isAdminAuthConfigured() {
  return Boolean(
    process.env.BETTER_AUTH_SECRET &&
      process.env.BETTER_AUTH_URL &&
      process.env.GITHUB_CLIENT_ID &&
      process.env.GITHUB_CLIENT_SECRET &&
      process.env.ADMIN_GITHUB_ID
  );
}

export const auth = betterAuth({
  appName: "Aryan Portfolio Admin",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3001",
  secret: process.env.BETTER_AUTH_SECRET ?? disabledSecret,
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "admin-auth-disabled",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "admin-auth-disabled",
      mapProfileToUser: (profile) => ({
        email: `${profile.id}@github.admin.invalid`
      })
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "jwe",
      refreshCache: true
    }
  },
  account: {
    storeStateStrategy: "cookie",
    storeAccountCookie: true
  },
  advanced: {
    cookiePrefix: "portfolio-admin",
    useSecureCookies: process.env.NODE_ENV === "production"
  },
  telemetry: {
    enabled: false
  }
});
