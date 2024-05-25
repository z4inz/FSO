import { createSlice } from '@reduxjs/toolkit'
import usersService from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    }
  }
})

export const { setUsers } = usersSlice.actions

export const initialiseUsers = () => {
  return async dispatch => {
    const users = await usersService.getUsers()
    dispatch(setUsers(users))
  }
}

export default usersSlice.reducer