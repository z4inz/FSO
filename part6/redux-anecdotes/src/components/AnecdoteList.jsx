import { useSelector, useDispatch } from 'react-redux'
import { likeAnecdote } from '../reducers/anecdoteReducer'
import { searchFilter } from '../reducers/filterReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    return state.filter !== ''
    ? state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.content))
    : state.anecdotes
  })
  anecdotes.sort((a, b) => (b.votes - a.votes))
  const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id)
    dispatch(likeAnecdote(id))
  }

  return (
    <div>
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
    </div>
  )
}

export default AnecdoteList