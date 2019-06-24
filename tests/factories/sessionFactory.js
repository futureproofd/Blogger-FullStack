/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-template */
const { Buffer } = require('safe-buffer');
const Keygrip = require('keygrip');
const keys = require('../../config/keys');

const keygrip = new Keygrip([keys.cookieKey]);

// function takes a userFactory user
module.exports = (user) => {
  const sessionObject = {
    passport: {
      // note the toString because mongoose _id is an object
      user: user._id.toString(),
    },
  };
  // convert our userId to base64 like our cookie session
  const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
  const sig = keygrip.sign('session=' + session);

  return { session, sig };
};
