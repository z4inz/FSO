import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { Form, Button } from 'react-bootstrap'

const NewBlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()

  const addNewBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    dispatch(createBlog(blogObject))

    setTitle(''), setAuthor(''), setUrl('')
  }

  return (
    <Form style={{ paddingBottom: 5 }} onSubmit={addNewBlog}>
      <h3>Create new blog post</h3>
      <Form.Group>
        <Form.Label>title</Form.Label>
        <Form.Control
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>author</Form.Label>
        <Form.Control
          type="text"
          value={author}
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>url</Form.Label>
        <Form.Control
          type="text"
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        create
      </Button>
    </Form>
  )
}

export default NewBlogForm
