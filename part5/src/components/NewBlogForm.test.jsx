import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

describe('<NewBlogForm />', () => {
  let container
  let mockHandler

  test('form calls the event handler it received as props with the right details when a new blog is created', async () => {
    mockHandler = vi.fn()
    const user = userEvent.setup()

    container = render(
      <NewBlogForm createNewBlog={mockHandler} />
    ).container
    
    const input = screen.getAllByRole('textbox')
    const sendButton = screen.getByText('create')

    const testTitle = 'Best books'
    const testAuthor = 'Test author'
    const testURL = 'bestbooks.com'

    await user.type(input[0], testTitle)
    await user.type(input[1], testAuthor)
    await user.type(input[2], testURL)
    await user.click(sendButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe(testTitle)
    expect(mockHandler.mock.calls[0][0].author).toBe(testAuthor)
    expect(mockHandler.mock.calls[0][0].url).toBe(testURL)
  })
})