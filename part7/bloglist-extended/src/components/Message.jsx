const Message = ({ message, setMessage }) => {
  if (message.content === '') {
    return null
  }

  setTimeout(() => {
    setMessage({
      content: '',
      isError: false
    })
  }, 5000)

  return (
    <div className = {message.isError ? 'errorMessage' : 'message'}>
      {message.content}
    </div>
  )
}

export default Message