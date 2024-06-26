// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */

import { expect, test } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

const username = 'admin'
const password = 'p'

const deleteId = process.env.NODE_ENV === 'development' ? '60' : '1010'
const wrongDeleteName = 'wrong-name'

test.describe('authenticated', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Sign In' }).click()
    await page.getByPlaceholder('username').click()
    await page.getByPlaceholder('username').fill(username)
    await page.getByPlaceholder('password').click()
    await page.getByPlaceholder('password').fill(password)

    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible()
  })

  test.afterEach(async ({ page }) => {
    await page.getByRole('button', { name: 'Sign Out' }).click()
  })

  test('check delete validation', async ({ page }) => {
    await page.goto(`/book/${deleteId}`)

    await page.getByRole('link', { name: 'Delete Book' }).click()

    await page.getByPlaceholder('Enter Book Title').click()
    await page.getByPlaceholder('Enter Book Title').fill(wrongDeleteName)

    await page.getByRole('button', { name: 'Delete' }).click()

    await expect(
      page.getByText('Input does not match the book title.'),
    ).toBeVisible()
  })
})
