# Analytics

`track(eventName, params)` in `src/features/analytics/track.ts` validates params with a Zod schema per event and pushes to `window.dataLayer`. Nothing leaves the browser in the prototype.

| Event                | When                     | Key params                                             |
| -------------------- | ------------------------ | ------------------------------------------------------ |
| `view_item`          | Property page viewed     | property_id, type, zone, locality, price_usd, agent_id |
| `view_item_list`     | Listing/zone page viewed | list_name, results_count                               |
| `search`             | Search submitted         | zone, locality, type, price_min, price_max             |
| `filter_apply`       | Filter changed           | filter_name, value                                     |
| `map_toggle`         | List ↔ map               | view                                                   |
| `media_open`         | Immersive block opened   | property_id, format                                    |
| `whatsapp_click`     | Any WhatsApp button      | property_id, agent_id, placement                       |
| `generate_lead`      | Any form submitted       | channel (contact, video_visit, valuation), property_id |
| `download_ficha`     | PDF listing opened       | property_id                                            |
| `agent_profile_view` | Broker profile viewed    | agent_id                                               |

v1 adds first-party event storage, GA4 + Meta Pixel after cookie consent (Consent Mode v2), Search Console and UTM capture, as new sinks behind `track()`.
