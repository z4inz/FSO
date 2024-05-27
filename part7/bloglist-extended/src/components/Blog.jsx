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

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    paddingBottom: 5,
    marginBottom: 5
  }

  return (
    <div>
        <div style={blogStyle}>
          <li style={{ listStyleType: 'none' }}>{blog.title}</li>
          <li style={{ listStyleType: 'none' }}>{blog.url}</li>
          <li style={{ listStyleType: 'none' }}>{blog.likes} <button onClick={likeBlogpost}>like</button></li>
          <li style={{ listStyleType: 'none' }}>{blog.user.name}</li>
          <div style={deleteButtonHidden}>
            <button onClick={deleteBlog}>delete</button>
          </div>
        </div>
    </div>
  )
}

export default Blog