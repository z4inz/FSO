import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

  beforeEach(() => {
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

    container = render(
      <Blog blog={blog} />
    ).container
  })

  test('only renders blog title and author', async () => {
    await screen.findAllByText('new blog test user')

    const div = container.querySelector('.infoShown')
    expect(div).toHaveStyle('display: none')
  })
})