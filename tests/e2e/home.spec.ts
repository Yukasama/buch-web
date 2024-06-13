import { test, expect } from '@playwright/test'
import { appConfig } from '~/config/app'

const url = appConfig.url

test('has title', async ({ page }) => {
  await page.goto(url)
  await expect(page).toHaveTitle('Buch-Web')
})
