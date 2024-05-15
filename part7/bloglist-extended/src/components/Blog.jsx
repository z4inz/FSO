import { useState } from 'react'

const Blog = ({ blog, increaseBlogLike, removeBlog, username }) => {

  const [visible, setVisible] = useState(false)

  const infoHidden = { display: visible ? 'none' : '' }
  const infoShown = { display: visible ? '' : 'none' }
  const deleteButtonHidden = { display: (username === blog.user.username) ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const increaseLike = async () => {
    const newObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    increaseBlogLike(blog.id, newObject)
  }

  const deleteBlog = async () => {
    removeBlog(blog)
  }

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
      <div style={infoHidden}>
        <div style={blogStyle}>
          {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
        </div>
      </div>
      <div style={infoShown} className='infoShown'>
        <div style={blogStyle}>
          <li style={{listStyleType: 'none'}}>{blog.title} <button onClick={toggleVisibility}>hide</button></li>
          <li style={{listStyleType: 'none'}}>{blog.url}</li>
          <li style={{listStyleType: 'none'}}>{blog.likes} <button onClick={increaseLike}>like</button></li>
          <li style={{listStyleType: 'none'}}>{blog.user.name}</li>
          <div style={deleteButtonHidden}>
            <button onClick={deleteBlog}>delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog