import { useState } from "react"
import { handleLogin } from "../reducers/userReducer"
import { useDispatch } from "react-redux"

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const loginClicked = async (event) => {
    event.preventDefault()
    dispatch(handleLogin(username, password))
    console.log('logging in with', username, password)
  }

  return (
    <form onSubmit={loginClicked}>
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

export default LoginForm