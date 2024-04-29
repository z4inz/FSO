const Anecdote = ({ anecdote }) => {
  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <div style={{paddingBottom: 10}}>has {anecdote.votes} votes</div>
      <div style={{paddingBottom: 10}}>for more info see <a href={anecdote.info}>{anecdote.info}</a></div>
    </div>
  )
}

export default Anecdote