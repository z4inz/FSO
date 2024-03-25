import { useState } from "react"

const Blog = ({ blog }) => {

  const [visible, setVisible] = useState(false)

  const infoHidden = {display: visible ? 'none' : ''}
  const infoShown = {display: visible ? '' : 'none'}

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    paddingTop: 5,
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
      <div style={infoShown}>
        <div style={blogStyle}>
          {blog.title} <button onClick={toggleVisibility}>hide</button>
          <br></br>
          {blog.url}
          <br></br>
          {blog.likes} <button onClick={() => {null}}>like</button>
          <br></br>
          {blog.user.name}
        </div>
      </div>
    </div>
  )
}

export default Blog