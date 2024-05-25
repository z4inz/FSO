import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

const IndividualUser = () => {
  const users = useSelector(state => state.users)
  const id = useParams().id
  const user = users.find(u => u.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <h2>added blogs</h2>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default IndividualUser