const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog
    .findById(request.params.id).populate('user', { username: 1, name: 1, id: 1 })

  response.json(blog)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user

  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments,
    user: user._id
  })

  const savedBlog = await blog.save()
  await savedBlog.populate('user', { username: 1, name: 1, id: 1 })
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blogUser = await Blog.findById(request.params.id)

  if (user.id === blogUser.user.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  else {
    response.status(401).json({ error: 'Invalid user, you don\'t have permission to delete this blog' })
  }
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments,
    user: body.user
  }

  const savedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
  await savedBlog.populate('user', { username: 1, name: 1, id: 1 })

  response.status(201).json(savedBlog)
})

blogsRouter.post('/:id/comments', middleware.userExtractor, async (request, response) => {
  const comment = request.body.comment
  const blog = await Blog.findById(request.params.id)

  blog.comments.push(comment)
  const savedBlog = await blog.save()
  await savedBlog.populate('user', { username: 1, name: 1, id: 1 })

  response.status(201).json(blog)
})

module.exports = blogsRouter