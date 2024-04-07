const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = await page.locator('.errorMessage')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Zain logged in')).not.toBeVisible()
    })

    test('succeeds with correct details', async ({ page }) => {
      await page.getByTestId('username').fill('zain')
      await page.getByTestId('password').fill('wowman')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.locator('.message').getByText('Zain logged in')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('zain')
      await page.getByTestId('password').fill('wowman')
      await page.getByRole('button', { name: 'login' }).click()
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

    test('a blog can be edited', async ({ page }) => {
      await createBlog(page, 'test', 'test', 'test.com')
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText(`Blog 'test' has been liked`)).toBeVisible()
      await expect(page.getByText('1')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await createBlog(page, 'test', 'test', 'test.com')
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'delete' }).click()
      await expect(page.getByText(`'test' by test has been deleted`)).toBeVisible()
      await expect(page.getByText('test')).not.toBeVisible()
    })
  })

  test('when logged in and and a blog exists', async ({ page, request }) => {
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test',
        username: 'test',
        password: 'wowman'
      }
    })
    loginWith(page, 'zain', 'wowman')
    await createBlog(page, 'test', 'test', 'test.com')
    await page.getByRole('button', { name: 'view' }).click()
    await expect(page.getByText('delete')).toBeVisible()
    await page.getByRole('button', { name: 'logout' }).click()
    loginWith(page, 'test', 'wowman')
    await page.getByRole('button', { name: 'view' }).click()
    await expect(page.getByText('delete')).not.toBeVisible()
  })

  test('blogs are arranged in the order according to likes', async ({ page, request }) => {
    await loginWith(page, 'zain', 'wowman')
    await expect(page.locator('.message').getByText('Zain logged in')).toBeVisible()
    const token = await page.evaluate(async () => {
      return JSON.parse(localStorage.getItem('loggedInUser')).token})

    await request.post('http://localhost:3003/api/blogs', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        title: '1 like',
        author: 'zain',
        url: 'test.com',
        likes: 1,
        user: '6611bfef7b643edb1f50c58c'
      }
    })
    await request.post('http://localhost:3003/api/blogs', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        title: '1000 likes',
        author: 'zain',
        url: 'test.com',
        likes: 1000,
        user: '6611bfef7b643edb1f50c58c'
      }
    })
    await request.post('http://localhost:3003/api/blogs', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        title: '50 likes',
        author: 'zain',
        url: 'test.com',
        likes: 50,
        user: '6611bfef7b643edb1f50c58c'
      }
    })
    await request.post('http://localhost:3003/api/blogs', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        title: '500 likes',
        author: 'zain',
        url: 'test.com',
        likes: 500,
        user: '6611bfef7b643edb1f50c58c'
      }
    })
    await request.post('http://localhost:3003/api/blogs', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        title: '25 likes',
        author: 'zain',
        url: 'test.com',
        likes: 25,
        user: '6611bfef7b643edb1f50c58c'
      }
    })
    await request.post('http://localhost:3003/api/blogs', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        title: '10000 likes',
        author: 'zain',
        url: 'test.com',
        likes: 10000,
        user: '6611bfef7b643edb1f50c58c'
      }
    })

    await page.reload()
    await expect(page.getByText('Blogs')).toBeVisible()
    await page.getByText('10000 likes zain view').waitFor()
    const likes = await page.getByText('zain view').all()
    await expect(await likes[0].innerText()).toEqual('10000 likes zain view')
    await expect(await likes[1].innerText()).toEqual('1000 likes zain view')
    await expect(await likes[2].innerText()).toEqual('500 likes zain view')
    await expect(await likes[3].innerText()).toEqual('50 likes zain view')
    await expect(await likes[4].innerText()).toEqual('25 likes zain view')
    await expect(await likes[5].innerText()).toEqual('1 like zain view')
  })
})