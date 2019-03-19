'use strict';
/**
 *{type:'int'}
 */
module.exports = class IntCheck extends require('../base') {
  static get type() {
    return 'int';
  }
  check(value) {
    if (typeof value !== 'number' || value % 1 !== 0) {
      return 'should be an integer';
    }
    if ('max' in this.rule && value > this.rule.max) {
      return 'should smaller than ' + this.rule.max;
    }
    if ('min' in this.rule && value < this.rule.min) {
      return 'should bigger than  ' + this.rule.min;
    }
  }
  conver(value) {
    if (typeof value !== 'string') {
      return;
    }
    return parseInt(value, this.rule.radix);
  }
};
