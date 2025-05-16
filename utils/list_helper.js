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
    let group =  _.countBy(blogs,'author')
    let groupArray = Object.keys(group).map(key => ({
        author: key,
        blogs: group[key]
    }));
    return _.maxBy(groupArray, 'blogs')
}

const mostLikes = (blogs) => {
    let group =  _.groupBy(blogs,'author')
    let groupArray =  _.map(group, (items, author) => ({
        author: author,
        likes: _.sumBy(items, 'likes')}
    ))
    return _.maxBy(groupArray, 'likes')
}

  
module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}