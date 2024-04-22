import { useSelector, useDispatch } from 'react-redux'
import { increaseVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    return state.filter !== ''
    ? state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter))
    : state.anecdotes
  })
  
  const sortedAnecdotes = [...anecdotes].sort((a, b) => (b.votes - a.votes))
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    console.log('vote', anecdote.id)
    dispatch(increaseVote(anecdote))
    dispatch(setNotification(`'${anecdote.content}' has been voted for`, 5))
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
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList