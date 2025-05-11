const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const totalLikes = listHelper.totalLikes

describe('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }
    ]

    const listWithTwoBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      },
      {
        _id: '3a422aa71b54a676234d17f8',
        title: 'Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: '',
        likes: 39,
        __v: 0
      }
    ]
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = totalLikes(listWithOneBlog)
      assert.deepStrictEqual(result, 5)
    }),
    
    test('when list has two blogs, counts the likes of that', () => {
      const result = totalLikes(listWithTwoBlogs)
      assert.deepStrictEqual(result, 44)
    }),
    
    test('when list has 0 blogs, returns 0 likes', () => {
      const result = totalLikes([])
      assert.deepStrictEqual(result, 0)
    })
  })