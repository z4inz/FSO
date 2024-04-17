import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    return state.filter !== ''
    ? state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter))
    : state.anecdotes
  })
  
  const sortedAnecdotes = [...anecdotes].sort((a, b) => (b.votes - a.votes))
  const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id)
    dispatch(voteAnecdote(id))
    const votedAnecdote = anecdotes.find(anecdote => anecdote.id === id)
    dispatch(setNotification(`'${votedAnecdote.content}' has been voted for`))
  }

  return (
    <div>
      {sortedAnecdotes.map(anecdote =>
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