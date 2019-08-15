/* eslint-disable no-extend-native */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable prefer-template */
/* eslint-disable no-undef */
const Page = require('./helpers/page');

let page;

// avoid strange error on tests
// eslint-disable-next-line no-underscore-dangle
Number.prototype._called = {};

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('the header has the correct text', async () => {
  const text = await page.getContentsOf('a.brand-logo');
  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

describe('when logged in', async () => {
  beforeEach(async () => {
    await page.login();
  });

  test('shows My Blogs button', async () => {
    const text = await page.getContentsOf('.right a[href="/blogs"]');
    expect(text).toEqual('My Blogs');
  }, 40000);

  test('shows logout button', async () => {
    // get the logout button
    const text = await page.getContentsOf('a[href="/auth/logout"]');
    expect(text).toEqual('Logout');
  }, 40000);

  test('click logout button redirects to /', async () => {
    await page.click('a[href="/auth/logout"]');
    const url = await page.url();
    expect(url).toMatch('/');
  }, 40000);

  test('click My Blogs button redirects to /blogs', async () => {
    await page.click('.right a[href="/blogs"]');
    const url = await page.url();
    expect(url).toMatch('/blogs');
  }, 40000);
});
