import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  return (
    <div>
      {notification.message !== '' && (
        <div className={notification.isError ? 'errorMessage' : 'message'}>
          {notification.message}
        </div>
      )}
    </div>
  )
}

export default Notification
