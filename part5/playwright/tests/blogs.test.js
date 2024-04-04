const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Zain',
        username: 'zain',
        password: 'wowman'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('fails with incorrect details', async ({ page }) => {
      await page.getByTestId('username').fill('wrong')
      await page.getByTestId('password').fill('incorrect')
      await page.getByRole('button', { name: 'login'}).click()

      const errorDiv = await page.locator('.errorMessage')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Zain logged in')).not.toBeVisible()
    })

    test('succeeds with correct details', async ({ page }) => {
      await page.getByTestId('username').fill('zain')
      await page.getByTestId('password').fill('wowman')
      await page.getByRole('button', { name: 'login'}).click()

      await expect(page.locator('.message').getByText('Zain logged in')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('zain')
      await page.getByTestId('password').fill('wowman')
      await page.getByRole('button', { name: 'login'}).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog post'}).click()
      await page.getByTestId('title').fill('test')
      await page.getByTestId('author').fill('test')
      await page.getByTestId('url').fill('test.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText(`A new blog 'test' by test added`)).toBeVisible()
      await expect(page.getByText('test test')).toBeVisible()
    })
  })
})