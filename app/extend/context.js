'use strict';
module.exports = {
  check(rules, data) {
    return this.app.validator.validate(rules, data);
  },
  v(rules, data) {
    if (!data) {
      data = Object.assign({}, this.query, this.request.body, this.params);
    }
    const errors = this.check(rules, data);
    if (errors) {
      const { errorStatus, errorMessage, errorCode } = this.app.config.httpParameter;
      this.throw(errorStatus, errorMessage, {
        code: errorCode,
        errors,
      });
    }
    return data;
  },
};
