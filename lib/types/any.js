'use strict';
/**
 *{type:'any'}
 */
module.exports = class AnyCheck extends require('../base') {

  static get type() {
    return 'any';
  }

  check() {}

  conver(value) {
    return value;
  }
};
