'use strict';
const moment = require('moment');
/**
 *{type:'string',max:10,min:0,allowEmpty:true,trim:false}
 */
const defaultFormat = 'YYYY-MM-DD HH:mm:ss';
module.exports = class DateCheck extends require('../base') {
  static get type() {
    return 'date';
  }
  check(value) {
    if (value instanceof Date) {
      return;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
      const fm = this.rule.format || defaultFormat;
      value = moment(value, fm);
    }
    return (value && typeof value.isValid === 'function' && value.isValid() ? undefined : 'must be date');
  }
  conver(value) {
    if (typeof value !== 'string') {
      return;
    }
    if (!value.trim()) {
      return;
    }
    const fm = this.rule.format || defaultFormat;
    const val = moment(value, fm);
    if (!val.isValid()) {
      return;
    }
    if (this.rule.moment) {
      return val;
    } else if (this.rule.string) {
      return val.format(fm);
    }
    return val.toDate();

  }
};
