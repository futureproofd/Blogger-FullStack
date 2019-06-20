/* eslint-disable new-cap */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

// use promises instead of callbacks for redis client
client.get = util.promisify(client.get);

const { exec } = mongoose.Query.prototype;

mongoose.Query.prototype.exec = async function () {
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    }),
  );

  // check redis for a value for 'key'
  const cacheValue = await client.get(key);

  if (cacheValue) {
    // return the mongoose object of the cached JSON
    // note, we need to handle the case of an array (list of blog entries)
    const doc = JSON.parse(cacheValue);

    console.log('serving from cache:', doc);

    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }
  // otherwise issue the query on mongodb and store result in redis
  const result = await exec.apply(this, arguments);

  // add to cache in JSON format
  client.set(key, JSON.stringify(result));

  // return the actual mongoose document object
  console.log('serving from mongo');
  return result;
};
