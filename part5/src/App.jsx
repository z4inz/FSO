import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlogForm from './components/NewBlogForm'
import Message from './components/Message'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
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
            type="text"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button type="submit">login</button>
      </form>
    )
  }

  const displayNewBlogForm = () => {
    return (
      <NewBlogForm addNewBlog={addNewBlog} title={title} setTitle={setTitle} author={author} setAuthor={setAuthor} url={url} setUrl={setUrl}/>
    )
  }

  const displayBlogs = () => {
    return (
      <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
    )
  }

  const addNewBlog = async (event) => {
    event.preventDefault()
    console.log("wow")

    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    try {
      const response = await blogService.createBlogpost(blogObject)
      setBlogs(blogs.concat(response))
      setTitle(''), setAuthor(''), setUrl('')
      setMessage({
          content: `A new blog '${blogObject.title}' by ${blogObject.author} added`,
          isError: false
      })
      console.log(response)
    } catch (exception) {
      setMessage({
          content: exception.response.data.error,
          isError: true
      })
    }
  }

  return (
    <div>
      <Message message={message} setMessage={setMessage}/>
      {user === null ?
        loginForm() :
        <div>
          <h1>Blogs</h1>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          {displayNewBlogForm()}
          <br></br>
          {displayBlogs()}
        </div>
      }
    </div>
  )
}

export default App