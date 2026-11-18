# Propiedades Sierras Cordobesas — static prototype

Fully static demo (Next.js App Router, `output: 'export'`) of a real estate portal for the Sierras de Córdoba. No backend, no secrets, USD 0/month. All demo data is fictional. Private demo: `noindex` + `robots.txt` disallow all.

## Setup

```bash
nvm use            # Node 22 (.nvmrc)
pnpm install
pnpm dev           # http://localhost:3000
```

## Scripts

| Script                                             | Purpose                                                                               |
| -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `pnpm dev` / `pnpm build`                          | Dev server / static export to `out/`                                                  |
| `pnpm typecheck`, `pnpm lint`, `pnpm format:check` | Quality gates                                                                         |
| `pnpm test`                                        | Vitest unit tests                                                                     |
| `pnpm test:e2e`                                    | Playwright against `out/` (build first). Locally on old macOS use `PW_CHANNEL=chrome` |
| `pnpm data:validate`                               | Zod + referential checks of `src/data/*.json`                                         |
| `pnpm tsx scripts/generate-seed.ts`                | Regenerate demo JSON + placeholder images                                             |

## Structure

`src/lib/schemas.ts` (Zod domain), `src/lib/repository.ts` (interfaces over JSON; v1 swaps in Supabase), `src/features/analytics/track.ts` (typed stub), `src/content/es.ts` (all UI strings), `src/config/site.ts` (central WhatsApp, brand).

## Git flow and CI/CD

See [docs/GIT_FLOW.md](docs/GIT_FLOW.md) and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
