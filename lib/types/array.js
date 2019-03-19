'use strict';

/**
 *{type:'string',max:10,min:0,allowEmpty:true,trim:false}
 */
module.exports = class ArrayCheck extends require('../base') {
  static get type() {
    return 'array,arr';
  }
  check(value) {
    if (!Array.isArray(value)) {
      return 'should be an array';
    }
    const rule = this.rule;
    if ('max' in rule && value.length > rule.max) {
      return 'length should smaller than ' + rule.max;
    }
    if ('min' in rule && value.length < rule.min) {
      return 'length should bigger than ' + rule.min;
    }
    if (!rule.itemType) {
      return;
    }
    for (let i = 0; i < value.length; i++) {
      const errors = this.validator.validate({ inner: rule.itemType }, { inner: value[i] });
      if (errors) {
        return errors.toString();
      }
    }
  }
  conver(value) {
    if (typeof value !== 'string') {
      return;
    }
    if (value.trim() === '') {
      return [];
    }
    let arr = value.split(this.rule.sp || this.rule.separator || /[\s,，]+/);
    if (this.rule.itemType) {
      arr = arr.map(item => this.validator.transform(item, this.rule.itemType));
    }
    return arr;
  }
};
