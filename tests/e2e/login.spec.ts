// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */

import { expect, test } from '@playwright/test'

const username = 'admin'
const password = 'p'
const wrongPassword = 'x'

test('successful admin login and logout', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Sign In' }).click()

  await page.getByPlaceholder('Enter your username').click()
  await page.getByPlaceholder('Enter your username').fill(username)
  await page.getByPlaceholder('Enter your password').click()
  await page.getByPlaceholder('Enter your password').fill(password)

  await page.getByRole('button', { name: 'Sign In' }).click()
  await page.getByRole('button', { name: 'Sign Out' }).click()
})

test('failed admin login', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Sign In' }).click()

  await page.getByPlaceholder('Enter your username').click()
  await page.getByPlaceholder('Enter your username').fill(username)
  await page.getByPlaceholder('Enter your password').click()
  await page.getByPlaceholder('Enter your password').fill(wrongPassword)

  await page.getByRole('button', { name: 'Sign In' }).click()

  const logoutButton = page.getByRole('button', { name: 'Sign Out' })
  await expect(logoutButton).toHaveCount(0)
})
