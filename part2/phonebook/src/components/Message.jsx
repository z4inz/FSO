const Message = ({ message, errorMessage, setMessage }) => {
    if (message === null) {
      return null
    }
    let classMessage = 'message'
    if (errorMessage) {
      classMessage = 'messageRed'
    }
    setTimeout(() => {
      setMessage(null)
    }, 5000)
    return (
      <div className = {classMessage}>
        {message}
      </div>
    )
  }

export default Message