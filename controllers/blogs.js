const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    findedBlogs = await Blog.find({})
    response.json(findedBlogs)
})
  
blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    savedBlog = await blog.save()

    if (savedBlog) {
      response.status(201).json(savedBlog)
    }
})

module.exports = blogsRouter