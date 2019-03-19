'use strict';

module.exports = app => {
  app.get('/', async ctx => {
    console.log(this.ctx);
    const { name } = ctx.v({ name: 'string' });
    this.body = 'hi, ' + name;
  });
};
