'use strict';
const Validator = require('../lib/validator');
const assert = require('assert');
describe('test/validator.test.js', () => {
  const v = new Validator();
  it('required and msg', () => {
    let errors = v.validate({ name: { type: 'string', required: false } }, {});
    assert(errors === undefined);

    errors = v.validate({ name: { type: 'string', required: true, msg: 'I am error' } }, {});
    assert(errors[0] === 'I am error');
  });

  it('array', () => {
    const obj = { name: 'aaaa,bbbb' };
    let errors = v.validate({ name: { type: 'array' } }, obj);
    assert(errors === undefined);
    assert(Array.isArray(obj.name));
    assert(obj.name[0] === 'aaaa');
    assert(obj.name[1] === 'bbbb');
    const obj2 = { name: 'aaaa:bbbb' };
    errors = v.validate({ name: { type: 'arr', sp: ':' } }, obj2);
    assert(errors === undefined);
    assert(Array.isArray(obj2.name));
    assert(obj2.name[0] === 'aaaa');
    assert(obj2.name[1] === 'bbbb');
    errors = v.validate({ name: { type: 'arr' } }, {});
    assert(errors.length === 1);
  });

  it('array/itemType', () => {
    const obj = { name: '1111,2222,3333' };
    let errors = v.validate({ name: { type: 'arr', itemType: 'int' } }, obj);
    assert(errors === undefined);
    assert(obj.name[0] === 1111);
    errors = v.validate({ name: { type: 'arr', itemType: 'int' } }, { name: 'aaa,vvv,123' });
    assert(errors.length === 1);
  });

  it('bool', () => {
    const obj = { name: 'yes', name1: '0' };
    let errors = v.validate({ name: { type: 'bool' }, name1: 'bool' }, obj);
    assert(errors === undefined);
    assert(obj.name === true);
    assert(obj.name1 === false);

    const obj2 = { name: 'x' };
    errors = v.validate({ name: { type: 'boolean' } }, obj2);
    assert(errors.length === 1);
  });

  it('date', () => {
    const obj = { name: '2019-03-23' };
    let errors = v.validate({ name: { type: 'date' } }, obj);
    assert(errors === undefined);
    assert(obj.name instanceof Date);

    const obj2 = { name: 'xxxxxxxx' };
    errors = v.validate({ name: { type: 'date' } }, obj2);
    assert(errors.length === 1);
  });

  it('enum', () => {
    const obj = { name: '2' };
    let errors = v.validate({ name: [ '1', '2' ] }, obj);
    assert(errors === undefined);

    const obj2 = { name: 'xxxxxxxx' };
    errors = v.validate({ name: [ '123', '345' ] }, obj2);
    assert(errors.length === 1);
  });

  it('int', () => {
    const obj = { name: '2' };
    let errors = v.validate({ name: 'int' }, obj);
    assert(errors === undefined);

    const obj2 = { name: 'xxdas' };
    errors = v.validate({ name: { type: 'int' } }, obj2);
    assert(errors.length === 1);

    const obj3 = { name: '3' };
    errors = v.validate({ name: { type: 'int', min: 4 } }, obj3);
    assert(errors.length === 1);

    const obj4 = { name: '3' };
    errors = v.validate({ name: { type: 'int', max: 2 } }, obj4);
    assert(errors.length === 1);

    const obj5 = { name: '3' };
    errors = v.validate({ name: { type: 'int', min: 2, max: 6 } }, obj5);
    assert(errors === undefined);
  });

  it('number', () => {
    const obj = { name: '2.1' };
    let errors = v.validate({ name: 'number' }, obj);
    assert(errors === undefined);

    const obj2 = { name: 'xxdas' };
    errors = v.validate({ name: { type: 'number' } }, obj2);
    assert(errors.length === 1);

    const obj3 = { name: '3.2' };
    errors = v.validate({ name: { type: 'number', min: 4 } }, obj3);
    assert(errors.length === 1);

    const obj4 = { name: '3.2' };
    errors = v.validate({ name: { type: 'number', max: 2 } }, obj4);
    assert(errors.length === 1);

    const obj5 = { name: '3.4' };
    errors = v.validate({ name: { type: 'number', min: 2, max: 6 } }, obj5);
    assert(errors === undefined);
  });

  it('json', () => {

    const obj = { name: '{"cc":"fff"}' };
    let errors = v.validate({ name: 'json' }, obj);
    assert(errors === undefined);
    assert(JSON.stringify(obj.name) === '{"cc":"fff"}');
    const obj2 = { name: 'xxxxxxxx' };
    errors = v.validate({ name: 'json' }, obj2);
    assert(errors.length === 1);
  });

  it('string', () => {
    const obj = { name: '{"cc":"fff"}' };
    let errors = v.validate({ name: 'string' }, obj);
    assert(errors === undefined);

    const obj2 = { name: '' };
    errors = v.validate({ name: 'string' }, obj2);
    assert(errors.length === 1);

    const obj3 = { name: '' };
    errors = v.validate({ name: { type: 'string', allowEmpty: true } }, obj3);
    assert(errors === undefined);

    const obj4 = { name: 'xxxxxx' };
    errors = v.validate({ name: { type: 'string', min: 1, max: 5 } }, obj4);
    assert(errors.length === 1);

  });

});
