/* eslint-disable no-undef */
/* eslint-disable indent */
const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get(target, property) {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    // set the cookies
    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });

    // refresh and re-render page with session now set
    await this.page.goto('http://localhost:3000/blogs');
    // wait for anchor tag to render
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  /**
   * note the implicit return of fetch results
   * and the resolution (then) of that fetch
   */
  get(path) {
    return this.page.evaluate(
      _path => fetch(_path, {
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(res => res.json()),
      path,
    );
  }

  post(path, data) {
    return this.page.evaluate(
      (_path, _data) => fetch(_path, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(_data),
        }).then(res => res.json()),
      path,
      data,
    );
  }

  /**
   *
   * @param {Array} actions the array of action objects to call
   * @returns promise result of an array of promises that represent the running
   * page.evaluate function in our chromium instance
   * this[method] refers to the context of this, which is our page,
   * and calls the approprate passed in method
   */
  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => this[method](path, data)),
    );
  }
}

module.exports = CustomPage;
