const NewBlogForm = ({addNewBlog, title, setTitle, author, setAuthor, url, setUrl}) => {
  return (
    <form onSubmit={addNewBlog}>
      <h2>Create new blog post</h2>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="title"
          onChange={({target}) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="author"
          onChange={({target}) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          name="url"
          onChange={({target}) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default NewBlogForm