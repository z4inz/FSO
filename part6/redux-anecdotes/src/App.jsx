import { useSelector, useDispatch } from 'react-redux'
import { likeAnecdote, newAnecdote, } from './reducers/anecdoteReducer'

const App = () => {
  const anecdotes = useSelector(state => state)
  anecdotes.sort((a, b) => (b.votes - a.votes))
  const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id)
    dispatch(likeAnecdote(id))
  }

  const createAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    dispatch(newAnecdote(content))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={createAnecdote}>
        <div><input name="anecdote"/></div>
        <button type={"submit"}>create</button>
      </form>
    </div>
  )
}

export default App