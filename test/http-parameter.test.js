'use strict';

const request = require('supertest');
const mm = require('egg-mock');

describe.skip('test/http-parameter.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/http-parameter-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  it('should GET /', () => {
    return request(app.callback())
      .get('/')
      .set('Accept', 'application/json')
      .expect(400);
  });
});
