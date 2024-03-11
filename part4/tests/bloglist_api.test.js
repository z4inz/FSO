const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./bloglist_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[2])
  await blogObject.save()
})

test('returns correct amount of blogs in JSON format', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property of blog post is named "id"', async () => {
  const response = await api.get('/api/blogs')
  assert.notStrictEqual(response.body[0].id, undefined)
  assert.strictEqual(response.body[0]._id, undefined)
})

describe('creation of new blog posts', () => {
  test('successfully creates a new blog post', async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  })
  
  test('blog likes defaults to 0 if missing', async () => {
    const newBlog = {
      title: "Test blog post",
      author: "Zain",
      url: "http://zain.com",
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    const blogWithZeroLikes = blogsAtEnd.find(blog => blog.title === "Test blog post")
    assert.strictEqual(blogWithZeroLikes.likes, 0)
  })
  
  test('title missing', async () => {
    const newBlog = {
      author: "Zain",
      url: "http://zain.com",
      likes: 5
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
  
  test('url missing', async () => {
    const newBlog = {
      title: "Test blog post",
      author: "Zain",
      likes: 5
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('tests for deleting a blog post', () => {
  test('deleting a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    const content = blogsAtEnd.map(blog => blog.title)
    assert(!content.includes(blogToDelete.title))
  
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })
  
  test('deleting a blog post with invalid id causes a 400 error', async () => {
    await api
      .delete('/api/blogs/999')
      .expect(400)
  })
})

describe('tests for updating a blog post', () => {
  test('updating a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newBlog = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 50
    }
  
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(201)
  
    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd[0]
    
    assert.notStrictEqual(blogToUpdate.likes, updatedBlog.likes)
  })

  test('updating a blog post with invalid id causes a 400 error', async () => {
    const newBlog = {
      title: "Can't update this",
      author: "Zain",
      url: "canttouchthis.com",
      likes: 9000
    }
  
    await api
      .put('/api/blogs/999')
      .send(newBlog)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})