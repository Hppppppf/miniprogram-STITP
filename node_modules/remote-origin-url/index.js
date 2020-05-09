/*!
 * remote-origin-url <https://github.com/jonschlinkert/remote-origin-url>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

const parse = require('parse-git-config');

const originUrl = (options, cb) => {
  if (typeof options === 'function') {
    cb = options;
    options = null;
  }

  if (typeof options === 'string') {
    options = { path: options };
  }

  let promise = originUrl.promise(options);
  if (typeof cb === 'function') {
    promise.then(url => cb(null, url)).catch(cb);
    return;
  }
  return promise;
};

originUrl.promise = options => {
  return new Promise((resolve, reject) => {
    parse(options, (err, parsed) => {
      if (err) {
        reject(err.code !== 'ENOENT' ? err : undefined);
        return;
      }
      let origin = parsed[getKey(parsed)];
      resolve(origin ? origin.url : void 0);
    });
  });
};

originUrl.sync = options => {
  if (typeof options === 'string') {
    options = { path: options };
  }

  let parsed = parse.sync(options);
  if (parsed) {
    let origin = parsed[getKey(parsed)];
    return origin ? origin.url : void 0;
  }
};

function getKey(obj) {
  if (obj.hasOwnProperty('remote "origin"')) {
    return 'remote "origin"';
  }
  let keys = Object.keys(obj);
  return keys.find(key => /^remote /.test(key));
}

/**
 * Expose `originUrl`
 */

module.exports = originUrl;
