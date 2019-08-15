/* eslint-disable class-methods-use-this */
class BlogService {
  constructor(Blog) {
    this.Blog = Blog;
    this.listBlogs = this.listBlogs.bind(this);
    this.addBlog = this.addBlog.bind(this);
    this.deleteBlog = this.deleteBlog.bind(this);
  }

  // hook into our cache implementation (overrides mongoose query exec)
  async listBlogs(userId) {
    return this.Blog.find({ _user: userId }).cache({
      key: userId,
    });
  }

  async getBlog(userId, blogId) {
    return this.Blog.findOne({
      _user: userId,
      _id: blogId,
    });
  }

  async addBlog(blog) {
    await blog.save();
    return blog;
  }

  async deleteBlog(blogId) {
    return this.Blog.findByIdAndRemove({ _id: blogId });
  }
}

module.exports = BlogService;
