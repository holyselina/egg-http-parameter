'use strict';

const Validator = require('./lib/validator')
module.exports = app => {
	app.validator = new Validator()
}

