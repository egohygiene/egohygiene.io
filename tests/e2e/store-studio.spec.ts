import { expect, type Page, test } from "@playwright/test";

const studio = "/store/studio";
const signIn = (page: Page) => page.getByRole("button", { name: "Sign in as demo owner" });
const newDraft = (page: Page) => page.getByRole("button", { name: "New draft", exact: true });

test("demo owner authors, previews and removes a local draft without leaving the studio", async ({
  page,
  context,
  baseURL,
}) => {
  const externalRequests: string[] = [];
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === baseURL) {
      await route.continue();
      return;
    }
    externalRequests.push(url.origin);
    await route.abort("blockedbyclient");
  });
  const title = "Chromatic Signal Tee";
  const revisedTitle = "Chromatic Signal Studio Tee";
  const draftTitle = page.getByLabel("Product title", { exact: true });
  const description = page.getByRole("textbox", { name: "Description", exact: true });

  await page.goto(studio);
  await expect(page.getByRole("heading", { name: "Merch studio", exact: true })).toBeVisible();
  await expect(newDraft(page)).toHaveCount(0);
  await signIn(page).click();
  await newDraft(page).click();
  await draftTitle.fill(title);
  await page.getByLabel("Product type", { exact: true }).fill("T-shirt");
  await description.fill("Synthetic garment copy for the local owner journey.");
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await page.getByRole("button", { name: `Edit ${title}`, exact: true }).click();
  await expect(draftTitle).toHaveValue(title);
  await expect(description).toHaveValue("Synthetic garment copy for the local owner journey.");
  await draftTitle.fill(revisedTitle);
  await page.getByRole("button", { name: "Save draft", exact: true }).click();

  const openPreview = page.getByRole("button", { name: `Preview ${revisedTitle}`, exact: true });
  await openPreview.click();
  await expect(page.getByRole("heading", { name: revisedTitle, exact: true })).toBeVisible();
  await expect(page.getByText("Purchasing disabled", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /checkout|buy now/i })).toHaveCount(0);
  await expect(page).toHaveURL(studio);
  await page.getByRole("button", { name: "Back to drafts", exact: true }).click();
  await expect(openPreview).toBeFocused();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(signIn(page)).toBeVisible();
  await expect(openPreview).toHaveCount(0);

  await signIn(page).click();
  await expect(openPreview).toBeVisible();
  await page.reload();
  await expect(signIn(page)).toBeVisible();
  await expect(newDraft(page)).toHaveCount(0);
  await signIn(page).click();
  await expect(openPreview).toBeVisible();

  const remove = page.getByRole("button", { name: `Remove ${revisedTitle}`, exact: true });
  await remove.click();
  await page.getByRole("button", { name: "Cancel removal", exact: true }).click();
  await expect(openPreview).toBeVisible();
  await remove.click();
  await page.getByRole("button", { name: "Confirm remove", exact: true }).click();
  await expect(openPreview).toHaveCount(0);
  await page.reload();
  await signIn(page).click();
  await expect(newDraft(page)).toBeEnabled();
  await expect(openPreview).toHaveCount(0);
  expect(externalRequests).toEqual([]);
});

test("mobile studio stays in the viewport and supports keyboard activation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(studio);
  await expect(signIn(page)).toBeEnabled();
  await signIn(page).focus();
  await signIn(page).press("Enter");
  await expect(newDraft(page)).toBeEnabled();
  await newDraft(page).focus();
  await newDraft(page).press("Enter");
  await expect(page.getByLabel("Product title", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
});
