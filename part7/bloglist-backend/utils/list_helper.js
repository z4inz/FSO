const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0
  ? 0
  : blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  let maxVal = Number.MIN_VALUE
  let index = 0
  if (blogs.length === 0){
    return 0
  }
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > maxVal){
      maxVal = blogs[i].likes
      index = i
    }
  }
  return {
    title: blogs[index].title,
    author: blogs[index].author,
    likes: blogs[index].likes
  }
}

const mostBlogs = (blogs) => {
  let authors = {}
  for (let i = 0; i < blogs.length; i++) {
    const author = blogs[i].author
    if (authors[author]) {
      authors[author] += 1
    }
    else {
      authors[author] = 1
    }
  }
  let max = 0
  let author = ""
  for (let key in authors) {
    if (authors[key] > max) {
      max = authors[key]
      author = key
    }
  }
  return {
    author: author,
    blogs: max
  }
}

const mostLikes = (blogs) => {
  let authors = {}
  for (let i = 0; i < blogs.length; i++) {
    const author = blogs[i].author
    if (authors[author]) {
      authors[author] += blogs[i].likes
    }
    else {
      authors[author] = blogs[i].likes
    }
  }
  let likes = 0
  let author = ""
  for (let key in authors) {
    if (authors[key] > likes) {
      likes = authors[key]
      author = key
    }
  }
  return {
    author: author,
    likes: likes
  }
}

module.exports = {
  dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}