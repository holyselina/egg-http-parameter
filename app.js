'use strict';

const Validator = require('./lib/validator');
module.exports = app => {
  app.validator = new Validator(app.config.httpParameter.opts);
};

