'use strict';

/**
 *{type:'string',max:10,min:0,allowEmpty:true,trim:false}
 */
module.exports = class StringCheck extends require('../base') {
  static get type() {
    return 'string';
  }
  check(value) {
    const rule = this.rule;
    if (typeof value !== 'string') {
      return 'should be a string';
    }
    if (!rule.allowEmpty && value === '') {
      return 'should not be empty';
    }
    if (rule.allowEmpty && value === '') {
      return;
    }
    if ('max' in rule && value.length > rule.max) {
      return 'length should smaller than ' + rule.max;
    }
    if ('min' in rule && value.length < rule.min) {
      return 'length should bigger than ' + rule.min;
    }
    if (rule.regexp && !rule.regexp.test(value)) {
      return 'should match ' + rule.regexp;
    }
  }
  conver(value) {
    return this.rule.trim === false ? value : value.trim();
  }
};
