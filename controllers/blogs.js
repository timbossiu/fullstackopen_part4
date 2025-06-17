const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    findedBlogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(findedBlogs)
})
  
blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    foundUser = await User.findOne().sort({ field: 'asc', _id: -1 })

    blog.user = foundUser
    savedBlog = await blog.save()

    console.log(foundUser)
    foundUser.blogs = foundUser.blogs.concat(savedBlog.id)
    await foundUser.save()

    if (savedBlog) {
      response.status(201).json(savedBlog)
    }
})


blogsRouter.delete('/:id', async (request, response) => {
    deletedBlog = await Blog.findByIdAndDelete(request.params.id)

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