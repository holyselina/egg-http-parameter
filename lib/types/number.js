'use strict';
/**
 *{type:'number'}
 */
module.exports = class NumberCheck extends require('../base') {
  static get type() {
    return 'number';
  }
  check(value) {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'should be a number';
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
