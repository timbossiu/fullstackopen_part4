// Load the full build.
var _ = require('lodash');

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.length === 0 ?
        0 :
        blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
    const reducer = (max, current) => {
        return (max.likes > current.likes ? max : current)
    }

    return blogs.length === 0 ?
        null : blogs.reduce(reducer, blogs.at(0))
}

const mostBlogs = (blogs) => {
    return _.groupBy(blogs,'authors')
}

  
module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs
}