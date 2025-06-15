const assert = require('node:assert')
const { test, beforeEach, after, describe } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const mongoose = require('mongoose')


const api = supertest(app)

describe('when there is initially a new user created', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('create an user with too short name', async () => {
    const invalidUser = {
      username: 'zu',
      name: 'test',
      password: 'test'
    }

    const result = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)

      assert(result.body.error.includes('`username` (`zu`) is shorter than the minimum allowed length (3)'))
  }),

  test('create an user with too short password', async () => {
    const invalidUser = {
      username: 'test',
      name: 'test',
      password: 't'
    }

    const result = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)

    assert(result.body.error.includes('password has to be longer than three chars'))
  }),

  after(async () => {
    await mongoose.connection.close()
  })
})