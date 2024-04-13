export const searchFilter = (content) => {
  return {
    type: 'FILTER',
    payload: { content }
  }
}

const initialState = ''

const filterReducer = (state = '', action) => {
  switch(action.type) {
    case 'FILTER':
      return {
        ...state,
        content: action.payload.content
      }
    default:
      return initialState
  }
}

export default filterReducer