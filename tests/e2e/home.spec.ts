import { test, expect } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()
const url = process.env.REMIX_URL ?? 'http://localhost:5173'

test('has title', async ({ page }) => {
  await page.goto(url)
  await expect(page).toHaveTitle('Buch-Web')
})
