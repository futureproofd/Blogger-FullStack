/* eslint-disable no-extend-native */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable no-undef */
const Page = require('./helpers/page');

let page;
// avoid strange error on tests
// eslint-disable-next-line no-underscore-dangle
Number.prototype._called = {};

/**
 * for every single test
 */
beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('when logged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('can see blog create form', async () => {
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title');
  });

  describe('and using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'my title');
      await page.type('.content input', 'my content');
      await page.click('form button');
    });

    test('submitting takes user to review screen', async () => {
      const text = await page.getContentsOf('h5');
      expect(text).toEqual('Please confirm your entries');
    });

    test('submitting and saving adds blog to index screen', async () => {
      await page.click('button.green');
      // wait for request to go to backend
      await page.waitFor('.card');
      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');
      expect(title).toEqual('my title');
      expect(content).toEqual('my content');
    });
  });

  describe('and using invalid inputs', async () => {
    beforeEach(async () => {
      // simulate a click on the submit button w/o input fields
      await page.click('form button');
    });
    test('the form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');
      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});

describe('when user is not logged in', async () => {
  test('user cannot create blog posts', async () => {
    /**
     * note the implicit return of fetch results
     * and the resolution (then) of that fetch
     */
    const result = await page.evaluate(() => fetch('/api/blogs', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'my test title',
          content: 'my test content'
        })
      }).then(res => res.json()));

    expect(result).toEqual({ error: 'You must log in!' });
  });

  test('user cannot get a list of posts', async () => {
    const result = await page.evaluate(() => fetch('/api/blogs', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()));

    expect(result).toEqual({ error: 'You must log in!' });
  });
});
