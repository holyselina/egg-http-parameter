'use strict';

module.exports = class Base {

  constructor(validator, rule = {}, key) {
    this.validator = validator;
    this.rule = rule;
    this.key = key;
  }

  getMsg(msg) {
    if (msg) {
      if (this.rule.msg) {
        msg = this.rule.msg;
      } else {
        msg = this.key + ':' + msg;
      }
    }
    return msg;
  }

  verify(value) {
    if (value === null || value === undefined) {
      if (this.rule.required === false) {
        return;
      }
      return this.getMsg('required');
    }
    const msg = this.check(value);
    return this.getMsg(msg);
  }

  getDefault(value) {
    const def = this.rule.default;
    if (def !== undefined) {
      return typeof def === 'function' ? def() : def;
    }
    return value;
  }

  transform(value) {
    if (this.rule.isConver === false) {
      return value;
    }
    if (value === undefined || value === null) {
      return this.getDefault(value);
    }
    const val = this.conver(value);
    if (val !== undefined) {
      return val;
    }

    return value;
  }

  check() {
    throw new Error('not impl');
  }

  conver(value) {
    return value;
  }

};

