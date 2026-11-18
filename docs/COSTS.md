# Costs (prototype): USD 0/month

| Item          | Cost | Why                                                                                                                              |
| ------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------- |
| Hosting       | 0    | Static files on Cloudflare Pages free tier (or Vercel Hobby / GitHub Pages)                                                      |
| CI            | 0    | GitHub Actions free minutes                                                                                                      |
| Data          | 0    | JSON in repo, no database                                                                                                        |
| Images        | 0    | Placeholder SVGs; licensed photos (Unsplash/Pexels) to be credited in CREDITS.md                                                 |
| Maps          | 0    | Leaflet + OSM-based tiles. TODO: confirm tile provider terms before sharing widely (OSM's public tile server has a usage policy) |
| Nearby places | 0    | Overpass API called once at dev time                                                                                             |
| Analytics     | 0    | `track()` stub only; nothing leaves the browser                                                                                  |
