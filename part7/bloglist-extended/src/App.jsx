import { useState, useEffect } from 'react'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import BlogList from './components/BlogList'
import { createBlog, initialiseBlogs } from './reducers/blogReducer'

const App = () => {
  const blogs = useSelector((state) => state.blogs)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
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
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername(''), setPassword('')
      dispatch(
        setNotification({
          message: `${user.name} logged in`,
          isError: false
        })
      )
    } catch (exception) {
      dispatch(
        setNotification({
          message: 'Wrong username or password',
          isError: true
        })
      )
    }
    console.log('logging in with', username, password)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    dispatch(
      setNotification({
        message: `${user.name} logged out`,
        isError: false
      })
    )
    setUser(null)
  }

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <h2>Log in to application</h2>
        <div>
          username
          <input
            data-testid="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            data-testid="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    )
  }

  const addNewBlog = async (blogObject) => {
    try {
      dispatch(createBlog(blogObject))
      dispatch(
        setNotification({
          message: `A new blog '${blogObject.title}' by ${blogObject.author} added`,
          isError: false
        })
      )
    } catch (exception) {
      dispatch(
        setNotification({
          message: exception.response.data.error,
          isError: true
        })
      )
    }
  }

  const deleteBlog = async (blog) => {
    if (
      window.confirm(
        `Do you want to delete the blog '${blog.title}' by '${blog.author}'`
      )
    ) {
      try {
        await blogService.deleteBlogpost(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
        dispatch(
          setNotification({
            message: `'${blog.title}' by ${blog.author} has been deleted`,
            isError: false
          })
        )
      } catch (exception) {
        dispatch(
          setNotification({
            message: exception.response.data.error,
            isError: true
          })
        )
      }
    }
  }

  const newBlogForm = () => {
    return <NewBlogForm createNewBlog={addNewBlog} />
  }

  return (
    <div>
      <Notification message={message} setMessage={setMessage} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <h1>Blogs</h1>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="new blog post">{newBlogForm()}</Togglable>
          <br></br>
          <BlogList blogs={blogs} deleteBlog={deleteBlog} user={user} />
        </div>
      )}
    </div>
  )
}

export default App
