/* eslint-disable prefer-rest-params */
/* eslint-disable new-cap */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');

const client = redis.createClient(keys.redisUrl);

// use promises instead of callbacks for redis client
client.hget = util.promisify(client.hget);

const { exec } = mongoose.Query.prototype;

// Add caching method to mongoose prototype
mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  // make it chainable
  return this;
};

/**
 * Override native mongoose method
 * patches the execution of a mongoose query to use Redis caching
 *  and instantiate in the context of 'this', our mongoose instance
 */
mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  // Build a hashed key/value redis pair
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    }),
  );
  // check redis for a value for 'key'
  const cacheValue = await client.hget(this.hashKey, key);

  if (cacheValue) {
    // return the mongoose object of the cached JSON
    // note, we need to handle the case of an array (list of blog entries)
    const doc = JSON.parse(cacheValue);

    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }
  // otherwise issue the query on mongodb and store result in redis
  const result = await exec.apply(this, arguments);

  // add to cache in JSON format
  client.hset(this.hashKey, key, JSON.stringify(result));

  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
