'use strict';


module.exports = class EnumCheck extends require('../base') {
  static get type() {
    return 'enum';
  }
  check(value) {
    if (!Array.isArray(this.rule.values)) {
      throw new TypeError('check enum need array type values');
    }
    if (!this.rule.values.includes(value)) {
      return 'should be one of ' + this.rule.values.join(', ');
    }
  }
};
