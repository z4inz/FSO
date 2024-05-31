import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { ListGroup } from "react-bootstrap"

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <ListGroup>
        {sortedBlogs.map((blog) => (
          <ListGroup.Item key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} - {blog.author}</Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default BlogList