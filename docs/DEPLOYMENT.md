# CI/CD

## Workflows (`.github/workflows`)

| File                    | Trigger                                                             | Jobs                                                                                                               |
| ----------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `ci.yml`                | PRs and pushes to `main`/`develop`; reusable                        | quality (data, typecheck, lint, format) → unit → build (uploads `out/`) → e2e (Playwright + axe, desktop + mobile) |
| `deploy-preview.yml`    | PR to `main`/`develop`                                              | runs CI, then deploys `out/` as Cloudflare Pages preview `pr-<n>`                                                  |
| `deploy-production.yml` | push to `main` (production) or `develop` (staging), manual dispatch | runs CI, then deploys. Uses GitHub Environments `production` / `staging` (add required reviewers on `production`)  |
| `commitlint.yml`        | PR                                                                  | Conventional Commit check                                                                                          |

Deploy jobs skip with a warning until the secrets below exist, so CI stays green on a fresh repo.

## One-time setup (Cloudflare Pages, free, commercial use allowed)

1. Create a Cloudflare account and a Pages project (direct upload), e.g. `propiedades-sierras`.
2. GitHub → Settings → Secrets: `CLOUDFLARE_API_TOKEN` (Pages:Edit), `CLOUDFLARE_ACCOUNT_ID`. Variable: `CF_PAGES_PROJECT`.
3. Create GitHub Environments `staging` and `production`.
4. Enable branch protection per `docs/GIT_FLOW.md`.

The site is plain static files, so moving to Vercel, GitHub Pages or any host only means swapping the final deploy step.
