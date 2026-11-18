# Git flow

| Branch                          | Purpose                                                                                | Deploys to                           |
| ------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------ |
| `main`                          | Stable, always releasable                                                              | Production (Cloudflare Pages `main`) |
| `develop`                       | Integration branch                                                                     | Staging (`staging` branch alias)     |
| `feature/*`, `fix/*`, `chore/*` | Work branches, cut from `develop`                                                      | PR preview `pr-<n>`                  |
| `release/x.y.z`                 | Optional stabilization, cut from `develop`, merged into `main` and back into `develop` | —                                    |
| `hotfix/*`                      | Urgent fix, cut from `main`, merged into `main` and `develop`                          | —                                    |

Rules

- Never commit directly to `main` or `develop`; open a PR. Squash-merge features; merge-commit releases/hotfixes.
- Conventional Commits, enforced by husky locally and by the `commitlint` workflow on PRs.
- Required status checks (set in GitHub branch protection for `main` and `develop`): `Typecheck, lint, format`, `Unit tests`, `Static build`, `E2E (Playwright + axe)`, `Commit lint`. Require 1 review on `main`.
- Tag releases `vX.Y.Z` on `main`.
