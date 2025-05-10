const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
}
  
module.exports = {
    dummy,
    totalLikes
}