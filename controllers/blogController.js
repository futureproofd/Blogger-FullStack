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
