import type { Page } from "@playwright/test";

export class HomePage {
  constructor(private page: Page) {}
  goto() {
    return this.page.goto("/");
  }
  async search(opts: { locality?: string; type?: string; maxPrice?: string }) {
    if (opts.type) await this.page.getByTestId("search-type").selectOption(opts.type);
    if (opts.locality)
      await this.page.getByTestId("search-locality").selectOption({ label: opts.locality });
    if (opts.maxPrice) await this.page.getByTestId("search-price").selectOption(opts.maxPrice);
    await this.page.getByTestId("search-submit").click();
  }
}
