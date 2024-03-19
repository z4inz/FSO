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
    user: user._id
  })

  const savedBlog = await blog.save()
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
    response.status(401).json({ error: 'invalid user, you don\'t have permission to delete this blog'})
  }
})
 
blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blogUser = await Blog.findById(request.params.id)

  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  if (user.id === blogUser.user.toString()) {
    const savedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(201).json(savedBlog)
  }
  else {
    response.status(401).json({ error: 'invalid user, you don\'t have permission to delete this blog'})
  }
})

module.exports = blogsRouter