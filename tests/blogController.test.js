/* eslint-disable no-undef */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const { Blog } = require('../models');

describe('BlogController operations', () => {
  beforeAll(async () => {
    db = await mongoose.createConnection('mongodb://127.0.0.1:27017/test');
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    await Blog.remove({});
  });

  test('returns 404', async () => {
    await request(app)
      .get('/bogusRoute')
      .expect(404);
  });

  /*
  test('returns 401 for /blogs without auth', async () => {
    await request(app)
      .get('/blogs')
      .expect(401);
  });
  */
});
