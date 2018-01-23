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

  describe('filterRules method:', () => {
    it('returns an array of filtered rules', () => {
      let res = socialScanner.filterRules(['github']);
      expect(Array.isArray(res)).toBeTruthy();
      expect(typeof res[0]).toBe('object');
      expect(res[0].name).toBe('github');
    });
  });

  describe('Test call with github profile:', () => {
    it('return an object containing informations', done => {
      socialScanner('b4dnewz', {
        capture: false,
        restrict: ['github']
      }, (err, results) => {
        expect(err).toBeNull();
        expect(results[0]).toBeDefined();
        expect(results[0]).toHaveProperty('name');
        expect(results[0]).toHaveProperty('category');
        expect(results[0]).toHaveProperty('value');
        expect(results[0]).toHaveProperty('address');
        expect(results[0]).toHaveProperty('error');
        done();
      });
    });
  });
});
