const Message = ({ message, errorMessage }) => {
    if (message === null) {
      return null
    }
    let classMessage = 'message'
    if (errorMessage) {
      classMessage = 'messageRed'
    }
    return (
      <div className = {classMessage}>
        {message}
      </div>
    )
  }

export default Message