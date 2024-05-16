import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: '',
  isError: false
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      return initialState
    }
  }
})

export const { addNotification, removeNotification } = notificationSlice.actions

export const setNotification = (message) => {
  return async dispatch => {
    dispatch(addNotification(message))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }
}

export default notificationSlice.reducer