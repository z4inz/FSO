import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map(blog =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
    deleteBlog(state, action) {
      const blogToDelete = action.payload
      console.log(blogToDelete)
      return state.filter(blog =>
        blog.id !== blogToDelete.id
      )
    }
  }
})

export const { setBlogs, appendBlog, updateBlog, deleteBlog } = blogSlice.actions

export const initialiseBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    try {
      const newBlog = await blogService.createBlogpost(content)
      dispatch(appendBlog(newBlog))
      dispatch(
        setNotification({
          message: `A new blog '${newBlog.title}' by ${newBlog.author} added`,
          isError: false
        })
      )
    }
    catch (exception) {
      dispatch(
        setNotification({
          message: exception.response.data.error,
          isError: true
        })
      )
    }
  }
}

export const removeBlog = blog => {
  return async dispatch => {
    await blogService.deleteBlogpost(blog)
    dispatch(deleteBlog(blog))
  }
}

export const increaseLike = blog => {
  return async dispatch => {
    const newObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      comments: blog.comments,
      user: blog.user.id,
      id: blog.id
    }
    const likedBlog = await blogService.updateBlogpost(newObject)
    dispatch(updateBlog(likedBlog))
  }
}

export const createComment = (comment, id) => {
  return async dispatch => {
    const commentObject = {
      comment: comment
    }

    const updatedBlog = await blogService.commentOnBlogpost(commentObject, id)
    dispatch(updateBlog(updatedBlog))
  }
}

export default blogSlice.reducer