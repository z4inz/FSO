import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)  

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
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
        console.log("failed to login")
    }

    console.log('logging in with', username, password)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
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

  const displayBlogs = () => {
    return (
      <div>
      <h2>Blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
    )
  }

  return (
    <div>
      {user === null ?
        loginForm() :
        displayBlogs()
      }
    </div>
  )
}

export default App