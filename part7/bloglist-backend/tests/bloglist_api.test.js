const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./bloglist_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const getToken = async () => {
  const newUser = {
    name: 'zain',
    username: 'zain',
    password: 'test'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const userToken = await api
    .post('/api/login')
    .send({
      username: newUser.username,
      password: newUser.password
    })
    .expect(200)

  return userToken
}

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
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('successfully creates a new blog post', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 10,
    }

    const userToken = await getToken()
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  })
  
  test('blog likes defaults to 0 if missing', async () => {
    const newBlog = {
      title: 'Test blog post',
      author: 'Zain',
      url: 'http://zain.com',
    }

    const userToken = await getToken()
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    const blogWithZeroLikes = blogsAtEnd.find(blog => blog.title === "Test blog post")
    assert.strictEqual(blogWithZeroLikes.likes, 0)
  })

  test('missing token', async () => {
    const newBlog = {
      title: "No token",
      author: 'Zain',
      url: 'http://zain.com',
      likes: 5
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
  
  test('title missing', async () => {
    const newBlog = {
      author: 'Zain',
      url: 'http://zain.com',
      likes: 5
    }

    const userToken = await getToken()
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken.body.token}`)
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
  
  test('url missing', async () => {
    const newBlog = {
      title: 'Test blog post',
      author: 'Zain',
      likes: 5
    }

    const userToken = await getToken()
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken.body.token}`)
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('tests for deleting a blog post', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('deleting a blog post', async () => {
    const userToken = await getToken()

    const blogToBeDeleted = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken.body.token}`)
      .send({
        title: 'delete this',
        author: 'tester',
        url: 'testdelete.com'
      })
      .expect(201)

    const blogsAtStart = await helper.blogsInDb()
  
    await api
      .delete(`/api/blogs/${blogToBeDeleted.body.id}`)
      .set('Authorization', `Bearer ${userToken.body.token}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    const content = blogsAtEnd.map(blog => blog.title)
    assert(!content.includes(blogToBeDeleted.title))
  
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })
  
  test('deleting a blog post with invalid id causes a 400 error', async () => {
    const userToken = await getToken()

    await api
      .delete('/api/blogs/999')
      .set('Authorization', `Bearer ${userToken.body.token}`)
      .expect(400)
  })
})

describe('tests for updating a blog post', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
  })

  test('updating a blog post', async () => {
    const userToken = await getToken()

    const blogToBeUpdated = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken.body.token}`)
      .send({
        title: 'update this',
        author: 'tester',
        url: 'testupdate.com',
        likes: 25
      })
      .expect(201)

    const newBlog = {
      title: 'update this',
      author: 'tester',
      url: 'testupdate.com',
      likes: 50
    }
  
    await api
      .put(`/api/blogs/${blogToBeUpdated.body.id}`)
      .set('Authorization', `Bearer ${userToken.body.token}`)
      .send(newBlog)
      .expect(201)
  
    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd[0]
    
    assert.notStrictEqual(blogToBeUpdated.body.likes, updatedBlog.likes)
  })

  test('updating a blog post with invalid id causes a 400 error', async () => {
    const userToken = await getToken()

    const newBlog = {
      title: 'Can\'t update this',
      author: 'Zain',
      url: 'canttouchthis.com',
      likes: 9000
    }
  
    await api
      .put('/api/blogs/999')
      .set('Authorization', `Bearer ${userToken.body.token}`)
      .send(newBlog)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})