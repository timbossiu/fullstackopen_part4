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