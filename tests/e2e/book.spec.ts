// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */

import { test, expect } from '@playwright/test'
import { generateISBN } from '~/utils/generate-isbn'
import dotenv from 'dotenv'

dotenv.config()

const username = 'admin'
const password = 'p'

const titel = 'Titel'
const subtitel = 'Subtitel'
const isbn = generateISBN('ISBN-13') //'978-1-60309-511-2'
const price = '20'
const discount = '0.9'
const available = 'true'
const type = 'KINDLE'
const rating = '4'
const homepage = 'https://book.com'

const updateId = process.env.NODE_ENV === 'production' ? '1000' : '1'
const tag = 'Typescript'

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

test('create book', async ({ page }) => {
  await page.getByRole('link', { name: 'Lets Create' }).click()

  await page.getByPlaceholder('Enter Book Title').click()
  await page.getByPlaceholder('Enter Book Title').fill(titel)
  await page.getByPlaceholder('Enter Book Subtitle').click()
  await page.getByPlaceholder('Enter Book Subtitle').fill(subtitel)
  await page.getByPlaceholder('Enter ISBN').click()
  await page.getByPlaceholder('Enter ISBN').fill(isbn)
  await page.getByPlaceholder('Enter Price').click()
  await page.getByPlaceholder('Enter Price').fill(price)
  await page.getByPlaceholder('Enter Discount').click()
  await page.getByPlaceholder('Enter Discount').fill(discount)
  await page.getByLabel('Available').selectOption(available)
  await page.getByLabel('Type').selectOption(type)
  await page.getByPlaceholder('Enter Rating (1-5)').click()
  await page.getByPlaceholder('Enter Rating (1-5)').fill(rating)
  await page.getByPlaceholder('Enter Homepage URL').click()
  await page.getByPlaceholder('Enter Homepage URL').fill(homepage)
  await page.getByRole('button', { name: 'Create' }).click()

  const page1Promise = page.waitForEvent('popup')
  await page.getByRole('link', { name: 'View Book at: http://' }).click()
  const page1 = await page1Promise
  expect(page1.url()).toContain('/book/')
})

test('update book data', async ({ page }) => {
  await page.goto(`/book/${updateId}`)
  await page.getByRole('button', { name: 'Edit Book' }).click()

  await page.locator('input[name="homepage"]').click()
  await page.locator('input[name="homepage"]').fill('https://book-web.com')
  await page
    .getByLabel('Modify Book Information')
    .locator('polygon')
    .nth(2)
    .click()
  await page.getByRole('combobox').selectOption('DRUCKAUSGABE')
  await page.locator('input[name="preis"]').click()
  await page.locator('input[name="preis"]').fill('25')
  await page.locator('input[name="rabatt"]').click()
  await page.locator('input[name="rabatt"]').fill('10')
  await page.getByRole('button', { name: 'Update' }).click()

  await expect(page.getByText('22.50€')).toBeVisible()

  await page.getByLabel('Add Tag').click()
  await page.getByLabel('Tag Input').click()
  await page.getByLabel('Tag Input').fill(tag)
  await page.getByLabel('Confirm Tag').click()

  await expect(page.getByText(tag)).toBeVisible()
})

test('add and remove book tag', async ({ page }) => {
  await page.goto(`/book/${updateId}`)

  await page.getByLabel('Add Tag').click()
  await page.getByLabel('Tag Input').click()
  await page.getByLabel('Tag Input').fill(tag)
  await page.getByLabel('Confirm Tag').click()
  await expect(page.getByText(tag)).toBeVisible()

  await page.getByRole('button', { name: tag }).click()
  await expect(page.getByText(tag)).not.toBeVisible()
})

test('version number mismatch', async ({ page }) => {
  await page.goto(`/book/${updateId}`)

  await page.getByLabel('Add Tag').click()
  await page.getByLabel('Tag Input').click()
  await page.getByLabel('Tag Input').fill(tag)
  await page.getByLabel('Confirm Tag').click()
  await expect(page.getByText(tag)).toBeVisible()

  await page.getByRole('button', { name: tag }).click()
  await expect(page.getByText(tag)).not.toBeVisible()

  await page.getByRole('button', { name: 'Edit Book' }).click()
  await page.locator('input[name="preis"]').click()
  await page.locator('input[name="preis"]').fill('20')
  await page.getByRole('button', { name: 'Update' }).click()

  const specificBadge = page.locator(
    'span:text("Your data is outdated. Please refresh the page.")',
  )
  await expect(specificBadge).toHaveCount(1)

  await page.getByText('Close').click()
})
