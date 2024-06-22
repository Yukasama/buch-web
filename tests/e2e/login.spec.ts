import { test, expect } from '@playwright/test'
import { logger } from '~/lib/logger'

const username = 'admin'
const password = 'p'
const wrongPassword = 'x'

const prodUrl = 'https://buch-web.zenathra.com'

test('successful admin login and logout', async ({ page, baseURL }) => {
  logger.info('prodUrl=%s', baseURL)
  await page.goto(prodUrl)
  await page.getByRole('link', { name: 'Sign In' }).click()

  await page.getByPlaceholder('username').click()
  await page.getByPlaceholder('username').fill(username)
  await page.getByPlaceholder('password').click()
  await page.getByPlaceholder('password').fill(password)

  await page.getByRole('button', { name: 'Sign In' }).click()

  const logoutButton = page.getByRole('button', { name: 'Sign Out' })
  expect(logoutButton).not.toBeNull()
  await logoutButton.click()
})

test('failed admin login', async ({ page }) => {
  await page.goto(prodUrl)
  await page.getByRole('link', { name: 'Sign In' }).click()

  await page.getByPlaceholder('username').click()
  await page.getByPlaceholder('username').fill(username)
  await page.getByPlaceholder('password').click()
  await page.getByPlaceholder('password').fill(wrongPassword)

  await page.getByRole('button', { name: 'Sign In' }).click()
})
