// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */

import { test, expect } from '@playwright/test'
import { generateISBN } from '~/utils/generate-isbn'
import dotenv from 'dotenv'

dotenv.config()

const username = 'admin'
const password = 'p'

const loginUrl = '/login'
const homeUrl = '/'

const titel = 'Titel'
const subtitel = 'Subtitel'
const isbn = generateISBN('ISBN-13')
const price = '20'
const discount = '10'
const available = 'true'
const type = 'KINDLE'
const rating = '4'
const homepage = 'https://book.com'

const updateId1 = process.env.NODE_ENV === 'production' ? '1003' : '1'
const updateId2 = process.env.NODE_ENV === 'production' ? '1004' : '20'
const updateId3 = process.env.NODE_ENV === 'production' ? '1005' : '30'
const tag = 'typescript'

const wrongTitle = ''
const wrongUrl = 'wrong-url'
const wrongIsbn = '978-3-827-31552-'
const incorrectIsbn = '978-1-234-56789-1'
const wrongPrice = '-1'
const wrongDiscountHigh = '200'
const wrongDiscountLow = '-1'

test.describe('authenticated', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Sign In' }).click()
    await page.getByPlaceholder('username').click()
    await page.getByPlaceholder('username').fill(username)
    await page.getByPlaceholder('password').click()
    await page.getByPlaceholder('password').fill(password)

    await page.getByRole('button', { name: 'Sign In' }).click()

    await page.waitForURL(homeUrl)
    const currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe(homeUrl)

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

    const createPopup = page.waitForEvent('popup')
    await page.getByRole('link', { name: 'View Book at: http://' }).click()
    const bookPage = await createPopup
    expect(bookPage.url()).toContain('/book/')
  })

  test('update book data', async ({ page }) => {
    await page.goto(`/book/${updateId1}`)
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

  test('check book validation', async ({ page }) => {
    await page.goto(`/book/${updateId1}`)
    await page.getByRole('button', { name: 'Edit Book' }).click()

    await page.locator('input[name="titelwrapper"]').click()
    await page.locator('input[name="titelwrapper"]').fill(wrongTitle)
    await page.locator('input[name="isbn"]').click()
    await page.locator('input[name="isbn"]').fill(wrongIsbn)
    await page.locator('input[name="homepage"]').click()
    await page.locator('input[name="homepage"]').fill(wrongUrl)
    await page.locator('input[name="preis"]').click()
    await page.locator('input[name="preis"]').fill(wrongPrice)
    await page.locator('input[name="rabatt"]').click()
    await page.locator('input[name="rabatt"]').fill(wrongDiscountHigh)

    await page.getByRole('button', { name: 'Update' }).click()

    await expect(page.getByText('Title is required.')).toBeVisible()
    await expect(page.getByText('Invalid ISBN.')).toBeVisible()
    await expect(page.getByText('Invalid Homepage.')).toBeVisible()
    await expect(
      page.getByText("Book can't be sold for 0 or lower."),
    ).toBeVisible()
    await expect(
      page.getByText("Discount can't be more than 100%."),
    ).toBeVisible()

    await page.locator('input[name="rabatt"]').click()
    await page.locator('input[name="rabatt"]').fill(wrongDiscountLow)

    await page.getByRole('button', { name: 'Update' }).click()

    await expect(
      page.getByText("Discount can't be less than 0%."),
    ).toBeVisible()

    await page.reload()
    await page.getByRole('button', { name: 'Edit Book' }).click()

    await page.locator('input[name="isbn"]').click()
    await page.locator('input[name="isbn"]').fill(incorrectIsbn)
    await page.getByRole('button', { name: 'Update' }).click()

    const errorBadge = page.locator(
      'span:text("You have entered invalid data. Please check your input.")',
    )
    await expect(errorBadge).toHaveCount(1)

    await page.getByText('Close').click()
  })

  test('add and remove book tag', async ({ page }) => {
    await page.goto(`/book/${updateId2}`)

    await page.getByLabel('Add Tag').click()
    await page.getByLabel('Tag Input').click()
    await page.getByLabel('Tag Input').fill(tag)
    await page.getByLabel('Confirm Tag').click()
    await expect(page.getByText(tag)).toBeVisible()

    await page.getByRole('button', { name: tag }).click()
    await expect(page.getByText(tag)).not.toBeVisible()
  })

  test('version number mismatch', async ({ page }) => {
    await page.goto(`/book/${updateId3}`)

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

    const errorBadge = page.locator(
      'span:text("Your data is outdated. Please refresh the page.")',
    )
    await expect(errorBadge).toHaveCount(1)

    await page.getByText('Close').click()
  })
})

test('book not mutable due no login', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('link', { name: 'Lets Create' }),
  ).not.toBeVisible()

  await page.goto('/create')

  await page.waitForURL(`**${loginUrl}`)
  const currentUrl = new URL(page.url())
  expect(currentUrl.pathname).toBe(loginUrl)

  await page.goto(`/book/${updateId1}`)
  await expect(
    page.getByRole('button', { name: 'Edit Book' }),
  ).not.toBeVisible()
  await expect(page.getByLabel('Add Tag')).not.toBeVisible()
})
