/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../index');
const userFactory = require('./factories/userFactory');

describe('BlogController routes', async () => {
  test('returns 404', async () => {
    await request(app)
      .get('/api/bogusRoute')
      .expect(404);
  });

  test('returns 401 for /blogs without auth', async () => {
    await request(app)
      .get('/api/blogs')
      .expect(401);
  });

  describe('authenticated routes', async () => {
    beforeEach(async () => {
      const user = await userFactory();
      // const { session, sig } = sessionFactory(user);
    });

    test('returns 200 for authenticated session', async () => {
      await request(app)
        .get('/api/blogs')
        .expect(200);
    });
  });
});
