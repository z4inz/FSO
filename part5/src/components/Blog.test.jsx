import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  let mockHandler

  const blog = {
    title: "new blog",
    author: "test user",
    url: "example.com",
    likes: 5,
    user: {
      name: "zain",
      username: "zain"
    }
  }

  beforeEach(() => {
    mockHandler = vi.fn()

    container = render(
      <Blog blog={blog} increaseBlogLike={mockHandler} />
    ).container
  })

  test('only renders blog title and author by default', async () => {
    await screen.findAllByText('new blog test user')

    const div = container.querySelector('.infoShown')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, likes and url are shown', async () => {
    screen.debug()
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    screen.debug()

    const div = container.querySelector('.infoShown')
    expect(div).not.toHaveStyle('display: none')

    await screen.findByText(blog.url)
    await screen.findByText(blog.likes)
  })

  test('if the like button is clicked twice, the event handler is called twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const like = screen.getByText('like')
    await user.click(like)
    await user.click(like)

    expect(mockHandler.mock.calls).toHaveLength(2)

    const div = container.querySelector('.infoShown')
    expect(div).not.toHaveStyle('display: none')
  })
})