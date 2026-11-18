import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/propiedades/",
  "/zonas/traslasierra/",
  "/corredores/",
  "/corredores/corredor-aliado-mina-clavero/",
  "/tasaciones/",
  "/contacto/",
];

for (const route of routes) {
  test(`SEO basics on ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    expect((await page.title()).length).toBeGreaterThan(5);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{20,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.length).toBeGreaterThan(0);
    for (const j of ld) expect(() => JSON.parse(j)).not.toThrow();
  });
}

for (const route of ["/", "/propiedades/", "/zonas/traslasierra/"]) {
  test(`axe on ${route}`, async ({ page }) => {
    await page.goto(route);
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(r.violations).toEqual([]);
  });
}

test("404 is friendly Spanish", async ({ page }) => {
  await page.goto("/no-existe/");
  await expect(page.locator("h1")).toContainText("No encontramos");
});

test("SEO demo page inspects every public page and they all pass", async ({ page }) => {
  await page.goto("/seo/");
  const reports = page.getByTestId("seo-report");
  await expect(reports.first()).toBeVisible();
  const n = await reports.count();
  await expect(page.getByTestId("seo-summary")).toContainText(`${n} de ${n}`);
});
