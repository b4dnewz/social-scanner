'use strict';

const assert = require('assert');
const socialScanner = require('../index.js');

describe('socialScanner', () => {
  it('exports by default a function', () => {
    assert.equal(typeof socialScanner, 'function', 'it should export a function');
  });
  it('throw an error if target is empty', () => {
    assert.throws(() => socialScanner(''), Error, 'did not throw an error');
  });

  describe('getRules method:', () => {
    it('returns an array of object rules', () => {
      let res = socialScanner.getRules();
      expect(Array.isArray(res)).toBeTruthy();
      expect(typeof res[0]).toBe('object');
    });
  });
});
