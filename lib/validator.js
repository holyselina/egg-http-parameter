'use strict';

const fs = require('fs');
const path = require('path');

module.exports = class Validator {

  static get Base() {
    return require('./base');
  }

  constructor(opts = {}) {
    this.opts = opts;
    if (this.opts.isConver !== undefined) {
      this.isConver = this.opts.isConver;
    } else {
      this.isConver = true;
    }
    const dir = path.join(__dirname, './types');
    const files = fs.readdirSync(dir);
    this.types = {};
    for (const file of files) {
      const target = require(path.join(dir, file));
      this.addType(target);
    }
  }

  formatRule(rule) {
    if (typeof rule === 'string') {
      return { type: rule };
    }
    if (Array.isArray(rule)) {
      return { type: 'enum', values: rule };
    }
    if (rule instanceof RegExp) {
      return { type: 'string', regexp: rule };
    }
    return rule || {};
  }

  addType(clazz) {
    for (const type of clazz.type.split(',')) {
      this.types[type.toLowerCase()] = clazz;
    }
  }

  transform(value, rule, key) {
    return this.createChecker(rule, key).transform(value);
  }

  createChecker(rule, key) {
    rule = this.formatRule(rule);
    const Clazz = this.types[rule.type.toLowerCase()];
    if (!Clazz) {
      throw new TypeError('rule type must be one of ' + Object.keys(this.types).join(', ') +
        ', but the following type was passed: ' + rule.type);
    }
    return new Clazz(this, rule, key);
  }

  validate(rules, obj, isConver) {
    if (typeof rules !== 'object') {
      throw new TypeError('need object type rule');
    }
    const ruleKeys = Object.keys(rules);
    if (this.opts.clean !== false) {
      // 清除干扰的属性
      Object.keys(obj).forEach(objectKey => {
        if (!ruleKeys.includes(objectKey)) {
          delete obj[objectKey];
        }
      });
    }
    const errors = [];
    for (const key of ruleKeys) {
      const checker = this.createChecker(rules[key], key);
      if (isConver !== undefined ? isConver : this.isConver) {
        obj[key] = checker.transform(obj[key]);
      }
      const err = checker.verify(obj[key]);
      if (err) {
        errors.push(err);
      }
    }
    if (errors.length) {
      return errors;
    }
  }


};
