import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("kk@hh.nop");
  await page.locator("[name=password]").fill("sign-in");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign in Successful!")).toBeVisible();
});

test("should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Which Kriscane Branch?").fill("Test");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Hotels found in Test")).toBeVisible();
  await expect(page.getByText("Test")).toBeVisible();
});

test("should show hotel detail", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Which Kriscane Branch?").fill("Test");
  await page.getByRole("button", { name: "Search" }).click();

  await page.locator('a', { hasText: "Test Hotel39648" }).click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Book Now" })).toBeVisible();
});

// test("should book hotel", async ({ page }) => {
//   await page.goto(UI_URL);

//   await page.getByPlaceholder("Which Kriscane Branch?").fill("Annex");

//   const date = new Date();
//   date.setDate(date.getDate() + 3);
//   const formattedDate = date.toISOString().split("T")[0];
//   await page.getByPlaceholder("Check-out Date").fill(formattedDate);

//   await page.getByRole("button", { name: "Search" }).click();

//   await page.getByText("Kriscane Annex").click();
//   await page.getByRole("button", { name: "Book now" }).click();

//   await expect(page.getByText("Total Cost: NGN357.00")).toBeVisible();


//   await page.getByRole("button", { name: "Confirm Booking" }).click();
//   await expect(page.getByText("Booking Saved!")).toBeVisible();

//   await page.getByRole("link", { name: "My Bookings" }).click();
//   await expect(page.getByText("Kriscane Annex")).toBeVisible();
// });
