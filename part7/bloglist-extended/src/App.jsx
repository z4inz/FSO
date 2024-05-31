import { useEffect } from 'react'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import Togglable from './components/Togglable'
import { useSelector, useDispatch } from 'react-redux'
import BlogList from './components/BlogList'
import { initialiseBlogs } from './reducers/blogReducer'
import LoginForm from './components/LoginForm'
import { initialiseUser } from "./reducers/currentUserReducer"
import UsersList from "./components/UsersList"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import IndividualUser from './components/IndividualUser'
import Blog from './components/Blog'
import NavigationBar from './components/NavigationBar'


const App = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

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

  const newBlogForm = () => {
    return <NewBlogForm />
  }

  return (
    <div className="container">
      <Router>
        <Notification />
        {user === null ? (
          <LoginForm />
        ) : (
          <div>
            <NavigationBar />
            <h1>Blogs</h1>
            <Routes>
              <Route path="/users" element={<UsersList />} />
              <Route path="/users/:id" element={<IndividualUser />} />
              <Route path="/blogs/:id" element={<Blog />} />
              <Route path="/" element={<div><Togglable buttonLabel="new blog post">{newBlogForm()}</Togglable> <br /> <BlogList blogs={blogs} /></div>} />
            </Routes>
          </div>
        )}
      </Router>
    </div>
  )
}

export default App
