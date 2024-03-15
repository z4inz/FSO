const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./bloglist_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

describe('username/password tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('username not being provided should return error 400', async () => {
    const newUser = {
      name: 'test',
      password: 'test'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'User validation failed: username: Path `username` is required.')
  })

  test('username with a length of less than 3 should return error 400', async () => {
    const newUser = {
      username: 'ab',
      name: 'test',
      password: 'test'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, `User validation failed: username: Path \`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length (3).`)
  })

  test('username must be unique', async () => {
    const newUser = {
      username: 'test1',
      name: 'test2',
      password: 'test3'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const secondUser = {
      username: 'test1',
      name: 'name2',
      password: 'pass3'
    }
      
    const response = await api
      .post('/api/users')
      .send(secondUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, `expected \`username\` to be unique`)
  })

  test('password not being provided should return error 400', async () => {
    const newUser = {
      username: 'test',
      name: 'test',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'Password validation failed: password is required.')
  })

  test('password with a length of less than 3 should return error 400', async () => {
    const newUser = {
      username: 'test',
      name: 'test',
      password: 'ab'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'Password validation failed: password is shorter than the minimum allowed length (3).')
  })
})

after(async () => {
  await mongoose.connection.close()
})