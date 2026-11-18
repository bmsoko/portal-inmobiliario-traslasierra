import { expect, test } from "@playwright/test";
import { HomePage } from "./pages/HomePage";
import { ListingPage } from "./pages/ListingPage";

test("home search for Nono filters the listing, then Sierras filters and map toggle", async ({
  page,
}) => {
  await new HomePage(page).goto().then(() => new HomePage(page).search({ locality: "Nono" }));
  await expect(page).toHaveURL(/locality=nono/);
  const listing = new ListingPage(page);
  await expect(listing.cards().first()).toBeVisible();
  const nono = await listing.cards().count();
  expect(nono).toBeGreaterThan(1);

  await listing.openFilters();
  await listing.filter("nearRiver").check();
  await listing.filter("credit").check();
  await expect(page).toHaveURL(/nearRiver=1/);
  await expect(page).toHaveURL(/credit=1/);
  expect(await listing.cards().count()).toBeLessThan(nono);

  await page.getByTestId("view-map").click();
  await expect(page.getByTestId("map-view")).toBeVisible();
  await expect(page.locator(".price-pill").first()).toBeVisible();
});

test("reloading a filtered listing URL restores the same filters", async ({ page }) => {
  await page.goto("/propiedades/?type=LOTE&nearRiver=1&maxPrice=60000");
  const listing = new ListingPage(page);
  await listing.openFilters();
  await expect(listing.filter("type")).toHaveValue("LOTE");
  await expect(listing.filter("nearRiver")).toBeChecked();
  await expect(listing.filter("maxPrice")).toHaveValue("60000");
  await page.reload();
  await listing.openFilters();
  await expect(listing.filter("type")).toHaveValue("LOTE");
  await expect(listing.filter("nearRiver")).toBeChecked();
});

test("empty filters show guidance and can be cleared", async ({ page }) => {
  await page.goto("/propiedades/?maxPrice=1000");
  await expect(page.getByTestId("empty")).toBeVisible();
});
