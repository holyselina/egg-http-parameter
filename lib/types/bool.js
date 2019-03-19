'use strict';


module.exports = class BoolCheck extends require('../base') {
  static get type() {
    return 'bool,boolean';
  }
  check(value) {
    if (typeof value !== 'boolean') {
      return 'should be a boolean';
    }
  }
  conver(value) {
    if (value === 'yes' || value === '1' || value === 1 || value === 'true') {
      return true;
    } else if (value === 'no' || value === '0' || value === 0 || value === 'false') {
      return false;
    }
    return value;
  }
};
