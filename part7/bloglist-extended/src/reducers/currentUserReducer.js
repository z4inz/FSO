import { createSlice } from '@reduxjs/toolkit'
import loginService from "../services/login"
import blogService from "../services/blogs"
import { setNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    }
  }
})

export const { setUser } = userSlice.actions

export const initialiseUser = user => {
  return async dispatch => {
    dispatch(setUser(user))
  }
}

export const handleLogin = (username, password) => {
  return async dispatch => {
    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))

      blogService.setToken(user.token)
      dispatch(setUser(user))
      dispatch(
        setNotification({
          message: `${user.name} logged in`,
          isError: false
        })
      )
    }
    catch (exception) {
      dispatch(
        setNotification({
          message: exception.response.data.error,
          isError: true
        })
      )
    }
  }
}

export default userSlice.reducer