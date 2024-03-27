import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlogForm from './components/NewBlogForm'
import Message from './components/Message'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState({
    content: '',
    isError: false
  })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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
        username, password
      })
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername(''), setPassword('')
      setMessage({
        content: `${user.name} logged in`,
        isError: false
      })
    } catch (exception) {
      setMessage({
        content: `Wrong username or password`,
        isError: true
      })
    }

    console.log('logging in with', username, password)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    setMessage({
      content: `${user.name} logged out`,
      isError: false
    })
    setUser(null)
  }

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <h2>Log in to application</h2>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
          password
            <input
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

  const displayBlogs = () => {
    const sortedBlogs = blogs.sort((a, b) => (b.likes - a.likes))
    return (
      <div>
      {(sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} increaseBlogLike={increaseBlogLike} removeBlog={deleteBlog} username={user.username} />
      ))}
      </div>
    )
  }

  const addNewBlog = async (blogObject) => {
    try {
      const response = await blogService.createBlogpost(blogObject)
      console.log(response)
      setBlogs(blogs.concat(response))
      setMessage({
          content: `A new blog '${blogObject.title}' by ${blogObject.author} added`,
          isError: false
      })
    } catch (exception) {
      setMessage({
          content: exception.response.data.error,
          isError: true
      })
    }
  }

  const increaseBlogLike = async (id, blogObject) => {
    try {
      const response = await blogService.updateBlogpost(id, blogObject)
      console.log(response)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : response))
      setMessage({
          content: `Blog '${blogObject.title}' has been liked`,
          isError: false
      })
    } catch (exception) {
      setMessage({
        content: exception.response.data.error,
        isError: true
      })
    }
  }

  const deleteBlog = async (blog) => {
    if (window.confirm(`Do you want to delete the blog '${blog.title}' by '${blog.author}'`)) {
      try {
        const response = await blogService.deleteBlogpost(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setMessage({
          content: `'${blog.title}' by '${blog.author}' has been deleted`,
          isError: false
      })
      } catch (exception) {
        console.log(exception)
        setMessage({
          content: exception.response.data.error,
          isError: true
        })
      }
    }
  }

  const newBlogForm = () => {
    return (
      <NewBlogForm createNewBlog={addNewBlog} />
    )
  }

  return (
    <div>
      <Message message={message} setMessage={setMessage}/>
      {user === null ?
        loginForm() :
        <div>
          <h1>Blogs</h1>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel='new blog post'>
            {newBlogForm()}
          </Togglable>
          <br></br>
          {displayBlogs()}
        </div>
      }
    </div>
  )
}

export default App