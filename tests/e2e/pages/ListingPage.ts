import { expect, type Page } from "@playwright/test";

export class ListingPage {
  constructor(private page: Page) {}
  cards() {
    return this.page.getByTestId("property-card");
  }
  async expectCount(n: number) {
    await expect(this.page.getByTestId("results-count")).toContainText(
      n === 1 ? "1 propiedad" : `${n} propiedades`,
    );
  }
  async openFilters() {
    const toggle = this.page.getByTestId("filters-toggle");
    if ((await toggle.isVisible()) && (await toggle.getAttribute("aria-expanded")) !== "true")
      await toggle.click();
  }
  filter(name: string) {
    return this.page.getByTestId(`filter-${name}`);
  }
}
