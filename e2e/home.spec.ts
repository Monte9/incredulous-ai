import { test, expect, type Page } from "@playwright/test";

// Facts returned by the mocked /api/generateFact endpoint, in order.
const MOCK_FACTS = [
  { fact: "Octopuses have three hearts.", topic: "Animals" },
  { fact: "Honey never spoils.", topic: "Food" },
];

/**
 * Mock the server API routes so the suite is fast, deterministic, and requires
 * no real OpenAI/Airtable credentials. The route handlers run in the browser
 * context, so the actual Next.js API handlers are never invoked.
 */
async function mockApi(page: Page) {
  let factCall = 0;
  await page.route("**/api/generateFact**", async (route) => {
    const fact = MOCK_FACTS[Math.min(factCall, MOCK_FACTS.length - 1)];
    factCall += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(fact),
    });
  });

  await page.route("**/api/subscribe", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ id: "rec_mock_123" }),
    });
  });
}

test.describe("Incredulous AI home", () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
  });

  test("renders the header and the first fact", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".header_title")).toHaveText("Incredulous AI");
    await expect(
      page.getByText("Octopuses have three hearts.")
    ).toBeVisible({ timeout: 15_000 });
  });

  test("a reaction loads the next fact and increments the counter", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByText("Octopuses have three hearts.")
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Facts Viewed:\s*1\/500/)).toBeVisible();

    // The "🔥" reaction button (value="interesting").
    await page.locator('button[value="interesting"]').click();

    await expect(
      page.getByText("Honey never spoils.")
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Facts Viewed:\s*2\/500/)).toBeVisible();
  });

  test("the preferences modal opens from the header", async ({ page }) => {
    await page.goto("/");

    await page.locator("header button").click();

    await expect(
      page.getByRole("heading", { name: "Preferences" })
    ).toBeVisible();
  });
});
