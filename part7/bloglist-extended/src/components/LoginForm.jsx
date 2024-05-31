import { useState } from "react"
import { handleLogin } from "../reducers/currentUserReducer"
import { useDispatch } from "react-redux"
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from "react-router-dom"

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loginClicked = async (event) => {
    event.preventDefault()
    dispatch(handleLogin(username, password))
    console.log('logging in with', username, password)
    navigate('/')
  }

  return (
    <Form onSubmit={loginClicked}>
      <h2>Log in to the application</h2>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Login
      </Button>
    </Form>
  )
}

export default LoginForm