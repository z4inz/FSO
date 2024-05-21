import { useState, useEffect } from 'react'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import Togglable from './components/Togglable'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import BlogList from './components/BlogList'
import { initialiseBlogs } from './reducers/blogReducer'
import LoginForm from './components/LoginForm'
import { initialiseUser } from "./reducers/userReducer"

const App = () => {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [message, setMessage] = useState({
    content: '',
    isError: false
  })

  useEffect(() => {
    dispatch(initialiseBlogs())
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const theUser = JSON.parse(loggedInUserJSON)
      dispatch(initialiseUser(theUser))
      blogService.setToken(theUser.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    dispatch(
      setNotification({
        message: `${user.name} logged out`,
        isError: false
      })
    )
    dispatch(initialiseUser(null))
  }

  const newBlogForm = () => {
    return <NewBlogForm />
  }

  return (
    <div>
      <Notification message={message} setMessage={setMessage} />
      {user === null ? (
        <LoginForm />
      ) : (
        <div>
          <h1>Blogs</h1>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="new blog post">{newBlogForm()}</Togglable>
          <br></br>
          <BlogList blogs={blogs} />
        </div>
      )}
    </div>
  )
}

export default App
