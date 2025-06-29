const { test, after, beforeEach, before } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const assert = require('node:assert')

const api = supertest(app)

let token

before(async () => {
  await helper.saveTestToken()

  const res = await api
  .post('/api/login')
  .send({ username: 'test', password: 'test' })
  
  token = res.body.token
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs in db are returned the same amount as initiated', async() => {
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a valid blog can be added with an user', async () => {
  const newBlog = {
    author: 'Test',
    title: 'AsyncNew',
    url: 'http:test.com',
    likes: 2
  }

  const res2 = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(r => r.title)
  assert(titles.includes('AsyncNew'))
})

test('delete succesfully the blog with the same user ', async () => {
  const newBlog = {
    author: 'Test',
    title: 'AsyncNew',
    url: 'http:test.com',
    likes: 2
  }

  const res = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)

  lastBlogId = res.body.id


  await api
    .delete(`/api/blogs/${lastBlogId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
  
  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('delete the blog with no user provided', async () => {
  const newBlog = {
    author: 'Test',
    title: 'AsyncNew',
    url: 'http:test.com',
    likes: 2
  }

  const res = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)

  const lastBlogId = res.body.id

  await api
    .delete(`/api/blogs/${lastBlogId}`)
    .set('Authorization', `Bearer `)
    .expect(401)

})

test('blog is saved with renamed id not _id', async () => {
  blogsAtEnd = await helper.blogsInDb()
  assert.ok('id' in blogsAtEnd[0], '"id" field exists')
  assert.ok(!('_id' in blogsAtEnd[0]), '"_id" field does not exist')
})

test('a blog without likes will be added ', async () => {
  const newBlog = {
    author: 'Test',
    title: 'AsyncNew',
    url: 'http:test.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const addedBlog = await Blog.findOne({author: 'Test'})
  assert.strictEqual(addedBlog.likes, 0)
})

test('a blog without author and url will be added ', async () => {
  const newBlog = {
    title: 'AsyncNew',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('update succesfully a blog ', async () => {
  const blogsAtStart = await helper.blogsInDb()

  firstId = blogsAtStart[0].id

  const updatedBlog = {
    author: 'Test',
    title: 'AsyncNew',
    url: 'http:test.com',
  }


  await api
    .put(`/api/blogs/${firstId}`)
    .send(updatedBlog)
    .expect(200)
  
  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  assert.strictEqual(blogsAtEnd[0].author, updatedBlog.author)
  assert.strictEqual(blogsAtEnd[0].title, updatedBlog.title)
  assert.strictEqual(blogsAtEnd[0].url, updatedBlog.url)
  assert.strictEqual(blogsAtEnd[0].likes, blogsAtStart[0].likes)
})

after(async () => {
  await mongoose.connection.close()
})