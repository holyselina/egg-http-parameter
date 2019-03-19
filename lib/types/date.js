'use strict';
const moment = require('moment');
/**
 *{type:'string',max:10,min:0,allowEmpty:true,trim:false}
 */
module.exports = class DateCheck extends require('../base') {
  static get type() {
    return 'date';
  }
  check(value) {
    if (value instanceof Date) {
      return;
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
    const val = moment(value, this.rule.format || 'YYYY-MM-DD HH:mm:ss');
    if (!val.isValid()) {
      return;
    }
    return this.rule.moment ? val : val.toDate();
  }
};
