import { test, expect } from "@playwright/test";
import path from "path";

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

test("should allow user to add a hotel", async ({ page }) => {
  const randomID = Math.floor(Math.random() * 90000) + 10000

  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="branchName"]').fill(`Test Hotel${randomID}`);
  await page
    .locator('[name="description"]')
    .fill(`This is a description for the Test Hotel${randomID}`);
  await page.locator('[name="pricePerNight"]').fill("100");
  await page.selectOption('select[name="starRating"]', "3");

  await page.getByText("Budget").click();

  await page.getByLabel("Free Wifi").check();
  await page.getByLabel("Parking").check();

  await page.locator('[name="guestCount"]').fill("2");

  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "1.jpg"),
    path.join(__dirname, "files", "2.jpg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();
});

test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await expect(page.getByText("Kriscane Annex")).toBeVisible();
  await expect(page.getByText("kkkkkkkkkk")).toBeVisible();
  await expect(page.getByText("Luxury")).toBeVisible();
  await expect(page.getByText("NGN40000 per night")).toBeVisible();
  await expect(page.getByText("3 guests")).toBeVisible();
  await expect(page.getByText("4 Star Rating")).toBeVisible();

  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

// test("should edit hotel", async ({ page }) => {
//   await page.goto(`${UI_URL}my-hotels`);

//   await page.getByRole("link", { name: "View Details" }).first().click();

//   await page.waitForSelector('[name="name"]', { state: "attached" });
//   await expect(page.locator('[name="name"]')).toHaveValue("Dublin Getaways");
//   await page.locator('[name="name"]').fill("Dublin Getaways UPDATED");
//   await page.getByRole("button", { name: "Save" }).click();
//   await expect(page.getByText("Hotel Saved!")).toBeVisible();

//   await page.reload();

//   await expect(page.locator('[name="name"]')).toHaveValue(
//     "Dublin Getaways UPDATED"
//   );
//   await page.locator('[name="name"]').fill("Dublin Getaways");
//   await page.getByRole("button", { name: "Save" }).click();
// });
