'use strict';
/**
 *{type:'json'}
 */
module.exports = class JsonCheck extends require('../base') {
  static get type() {
    return 'json';
  }
  check(value) {
    return typeof value === 'object' ? undefined : 'must be json';
  }
  conver(value) {
    if (typeof value !== 'string') {
      return;
    }
    try {
      return JSON.parse(value);
    } catch (err) {
      return;
    }
  }
};
