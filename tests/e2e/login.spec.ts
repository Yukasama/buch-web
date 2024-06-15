import { test, expect } from '@playwright/test'
import { appConfig } from '~/config/app'

const url = appConfig.url

const username = 'admin'
const password = 'p'
const wrongPassword = 'x'

test('successful admin login and logout', async ({ page }) => {
  await page.goto(url)
  await page.getByRole('link', { name: 'Login' }).click()

  await page.getByPlaceholder('username').click()
  await page.getByPlaceholder('username').fill(username)
  await page.getByPlaceholder('password').click()
  await page.getByPlaceholder('password').fill(password)

  await page.getByRole('button', { name: 'Log in' }).click()

  const logoutButton = page.getByRole('button', { name: 'Log Out' })
  expect(logoutButton).not.toBeNull()
  await logoutButton.click()
})

test('failed admin login', async ({ page }) => {
  await page.goto(url)
  await page.getByRole('link', { name: 'Login' }).click()

  await page.getByPlaceholder('username').click()
  await page.getByPlaceholder('username').fill(username)
  await page.getByPlaceholder('password').click()
  await page.getByPlaceholder('password').fill(wrongPassword)

  await page.getByRole('button', { name: 'Log in' }).click()
})
