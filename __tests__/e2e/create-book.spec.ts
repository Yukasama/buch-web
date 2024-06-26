// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */

import { expect, test } from '@playwright/test'
import dotenv from 'dotenv'
import { generateISBN } from '~/utils/generate-isbn'

dotenv.config()

const username = 'admin'
const password = 'p'

const titel = 'Titel'
const subtitel = 'Subtitel'
const isbn = generateISBN('ISBN-13')
const price = '20'
const discount = '10'
const available = 'true'
const type = 'KINDLE'
const rating = '4'
const homepage = 'https://book.com'

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

  test.afterAll(async ({ page }) => {
    await page.goto('/book')
    await page.getByRole('link', { name: 'New Book' }).click()
    await page.getByPlaceholder('Enter Book Title').click()
    await page.getByPlaceholder('Enter Book Title').fill(titel)
    await page.getByPlaceholder('Enter ISBN').click()
    await page.getByPlaceholder('Enter ISBN').fill(isbn)
    await page.getByPlaceholder('Enter Price').click()
    await page.getByPlaceholder('Enter Price').fill(price)
    await page.getByPlaceholder('Enter Discount').click()
    await page.getByPlaceholder('Enter Discount').fill(discount)
    await page.getByLabel('In Stock').selectOption(available)
    await page.getByLabel('Type').selectOption(type)
    await page.getByPlaceholder('Enter Rating (1-5)').click()
    await page.getByPlaceholder('Enter Rating (1-5)').fill(rating)
    await page.getByPlaceholder('Enter Homepage URL').click()
    await page.getByPlaceholder('Enter Homepage URL').fill(homepage)
    await page.getByRole('button', { name: 'Create' }).click()
  })

  test('create book', async ({ page }) => {
    await page.getByRole('link', { name: 'New Book' }).click()

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
    await page.getByLabel('In Stock').selectOption(available)
    await page.getByLabel('Type').selectOption(type)
    await page.getByPlaceholder('Enter Rating (1-5)').click()
    await page.getByPlaceholder('Enter Rating (1-5)').fill(rating)
    await page.getByPlaceholder('Enter Homepage URL').click()
    await page.getByPlaceholder('Enter Homepage URL').fill(homepage)
    await page.getByRole('button', { name: 'Create' }).click()

    const createPopup = page.waitForEvent('popup')
    await page.getByRole('link', { name: 'View Book at: http://' }).click()
    const bookPage = await createPopup
    expect(bookPage.url()).toContain('/book/')
  })

  test('check create validation', async ({ page }) => {
    await page.getByRole('link', { name: 'New Book' }).click()

    await page.getByRole('button', { name: 'Create' }).click()

    await expect(page.getByText('Title is required.')).toBeVisible()
    await expect(page.getByText('ISBN is required.')).toBeVisible()
    await expect(
      page.getByText("Book can't be sold for 0 or lower."),
    ).toBeVisible()
    await expect(page.getByText('Rating must be atleast 1 Star')).toBeVisible()
    await expect(page.getByText('Invalid Homepage.')).toBeVisible()
  })
})
