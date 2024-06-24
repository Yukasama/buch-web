// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */

import { expect, test } from '@playwright/test'

const invalidSearch = 'no-match'

test('search books', async ({ page }) => {
  await page.goto('/')

  await page.getByPlaceholder('Search books').click()
  await page.getByPlaceholder('Search books').fill(invalidSearch)
  await page.getByPlaceholder('Search books').press('Enter')
  await expect(
    page.getByText('No books found for the search term: no-match'),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Reset' }).click()
  await page.getByLabel('Rate 3 stars').click()

  await expect(
    page.getByRole('cell', { name: '1', exact: true }),
  ).not.toBeVisible()
  await expect(
    page.getByRole('cell', { name: '2', exact: true }),
  ).not.toBeVisible()
  await expect(
    page.getByRole('cell', { name: '4', exact: true }),
  ).not.toBeVisible()
  await expect(
    page.getByRole('cell', { name: '5', exact: true }),
  ).not.toBeVisible()
})
