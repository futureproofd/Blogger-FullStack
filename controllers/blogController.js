const router = require('express').Router();
const requireLogin = require('../middlewares/requireLogin');
const cleanCache = require('../middlewares/cleanCache');
const Blog = require('../models/BlogModel');
const { blogService } = require('../services');

router.get('/api/blogs/:id', requireLogin, async (req, res) => {
  const blog = await blogService.getBlog(req.user.id, req.params.id);
  res.send(blog);
});

router.get('/api/blogs', requireLogin, async (req, res) => {
  const blogs = await blogService.listBlogs(req.user.id);
  res.send(blogs);
});

router.delete(
  '/api/blogs/delete/:id',
  requireLogin,
  cleanCache,
  async (req, res) => {
    console.log('request data', req.body.blogId);
    try {
      const del = await blogService.deleteBlog(req.body.blogId);
      if (!del) {
        res.status(404).send('Blog entry not found.');
      } else {
        res.status(204).send('Blog entry deleted.');
      }
    } catch (err) {
      res.send(500, err);
    }
  },
);

router.post('/api/blogs', requireLogin, cleanCache, async (req, res) => {
  const { title, content, imageUrl } = req.body;

  const newBlog = new Blog({
    imageUrl,
    title,
    content,
    _user: req.user.id,
  });

  try {
    await blogService.addBlog(newBlog);
    res.send(newBlog);
  } catch (err) {
    res.send(400, err);
  }
});

module.exports = router;
