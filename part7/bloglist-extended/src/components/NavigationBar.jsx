import { Link } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { initialiseUser } from "../reducers/currentUserReducer"
import { setNotification } from '../reducers/notificationReducer'
import { Button } from "react-bootstrap"

const NavigationBar = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const padding = {
    padding: 5
  }

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

  return (
    <div>
      <Link style={padding} to="/">blogs</Link>
      <Link style={padding} to="/users">users</Link>
      <span style={padding}>{user.name} logged in <Button onClick={handleLogout}>logout</Button></span>
    </div>
  )
}

export default NavigationBar