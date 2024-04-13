import { useSelector, useDispatch } from 'react-redux'
import { newAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  
  const createAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    console.log(event)
    dispatch(newAnecdote(content))
    event.target.anecdote.value = ''
  }
  
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createAnecdote}>
        <div><input name="anecdote" /></div>
        <button type={"submit"}>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm