import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    paddingBottom: 5,
    marginBottom: 5
  }

  return (
    <div>
      {sortedBlogs.map((blog) => (
        <Link to={`/blogs/${blog.id}`} key={blog.id}><div style={blogStyle}>{blog.title} - {blog.author}</div></Link>
      ))}
    </div>
  )
}

export default BlogList