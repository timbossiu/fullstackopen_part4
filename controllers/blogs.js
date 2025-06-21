const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getUserByToken = async (token) => {
  const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    return user
}


blogsRouter.get('/', async (request, response) => {
    findedBlogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(findedBlogs)
})
  
blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    console.log(request.token)

    const user = getUserByToken(request.token)
    
    if (!user) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }

    blog.user = user
    savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    if (savedBlog) {
      response.status(201).json(savedBlog)
    }
})


blogsRouter.delete('/:id', async (request, response) => {
    blogToBeDeleted = await Blog.findById(request.params.id)

    const currentUser = await getUserByToken(request.token)

    if (currentUser.id != blogToBeDeleted.user.toString()) {
      return response.status(400).json({ error: 'the current user does not have any authorities on this blog' })
    }

    deletedBlog = await Blog.deleteOne(blogToBeDeleted)

    if (deletedBlog) {
      response.status(204).json(deletedBlog)
    }
})

blogsRouter.put('/:id', async (request, response) => {

  blog = {
    author: request.body.author,
    title: request.body.title,
    url: request.body.url,
    likes: request.body.likes
  }

  updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

  if (updatedBlog) {
    response.status(200).json(deletedBlog)
  }
})

module.exports = blogsRouter