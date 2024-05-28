import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { increaseLike, removeBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useParams } from "react-router-dom"

const Blog = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const username = user.username
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)

  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  if (!user || !blog) {
    return null
  }

  const deleteButtonHidden = { display: (username === blog.user.username) ? '' : 'none' }

  const likeBlogpost = async () => {
    dispatch(increaseLike(blog))
    dispatch(
      setNotification({
        message: `The blog '${blog.title}' has been liked`,
        isError: false
      })
    )
  }

  const deleteBlog = async () => {
    if (window.confirm(
      `Do you want to delete the blog '${blog.title}' by '${blog.author}'`
    )) {
      dispatch(removeBlog(blog))
      dispatch(
        setNotification({
          message: `The blog '${blog.title}' has been deleted`,
          isError: false
        })
      )
    }
  }

  const addComment = async (event) => {
    event.preventDefault()
    console.log("wow")
  }

  return (
    <div>
      <li style={{ listStyleType: 'none' }}><h2>{blog.title}</h2></li>
      <li style={{ listStyleType: 'none' }}><a href={`https://${blog.url}`}>{blog.url}</a></li>
      <li style={{ listStyleType: 'none' }}>{blog.likes} likes <button onClick={likeBlogpost}>like</button></li>
      <li style={{ listStyleType: 'none' }}>added by {blog.user.name}</li>
      <div style={deleteButtonHidden}>
        <button onClick={deleteBlog}>delete</button>
      </div>
      <h2>comments</h2>
      <form onSubmit={addComment}>
        <input
          type="text"
          value={comment}
          name="comment"
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      {blog.comments.map(comment =>
        <li key={comment}>{comment}</li>
      )}
    </div>
  )
}

export default Blog