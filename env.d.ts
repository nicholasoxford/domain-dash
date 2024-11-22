// Generated by Wrangler by running `wrangler types --experimental-include-runtime --env-interface CloudflareEnv env.d.ts -c domains/agi-2025/wrangler.toml`

interface CloudflareEnv {
  kvcache: KVNamespace;
  BASE_URL: string;
  TURNSTILE_SITE_KEY: string;
  ADMIN_PASSWORD: string;
  API_AUTH_TOKEN: string;
  STRIPE_SECRET_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  PUBLIC_TURNSTILE_SITE_KEY: string;
  ASSETS: Fetcher;
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
}
