'use strict';

const assert = require('assert');
const socialScanner = require('../index.js');

describe('socialScanner', () => {
  jest.setTimeout(40000);

  it('exports by default a function', () => {
    assert.equal(typeof socialScanner, 'function', 'it should export a function');
  });

  it('throw an error if target is empty', () => {
    assert.throws(() => socialScanner(''), Error, 'did not throw an error');
  });

  it('scan only rule in given categories', done => {
    socialScanner('b4dnewz', {
      onlySuccess: true,
      restrictCategories: ['tech']
    }, (err, results) => {
      expect(err).toBeNull();
      expect(results).not.toBeNull();
      results.forEach(r => expect(r.category.includes('tech')));
      results.forEach(r => expect(r.error).toBeNull());
      done();
    });
  });

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
      expect(results[0]).toHaveProperty('body');
      done();
    });
  });

  it('return arrays of data in case of multiple urls', done => {
    socialScanner('b4dnewz', {
      capture: false,
      restrict: ['bandcamp']
    }, (err, results) => {
      expect(err).toBeNull();
      expect(results[0]).toBeDefined();
      expect(results[0]).toHaveProperty('address');
      expect(Array.isArray(results[0].address)).toBeTruthy();
      expect(Array.isArray(results[0].error)).toBeTruthy();

      // Is false since capture is "off"
      expect(Array.isArray(results[0].body)).toBeFalsy();
      done();
    });
  });

  it('wont return false positive if not pass all matches', done => {
    socialScanner('b4dnewz', {
      capture: false,
      restrict: ['ebay']
    }, (err, results) => {
      expect(err).toBeNull();
      expect(results).not.toBeNull();
      expect(typeof results[0]).toBe('object');
      expect(results[0].error.status).toBe(200);
      expect(results[0].error.error).toBe('NOTMATCH');
      done();
    });
  });

  it('accept custom HTTP request options', done => {
    socialScanner('b4dnewz', {
      capture: false,
      restrict: ['github'],
      requestOptions: {
        timeout: 1000,
        followRedirect: false
      }
    }, (err, results) => {
      expect(err).toBeNull();
      expect(results).not.toBeNull();
      done();
    });
  });

  it('return an base64 encoded string by default', done => {
    socialScanner('b4dnewz', {
      restrict: ['github'],
      capture: true,
      screenshotOptions: {
        onlySuccess: false
      }
    }, (err, results) => {
      expect(err).toBeNull();
      expect(results[0]).toHaveProperty('body');
      expect(/[A-Za-z0-9+/=]/.test(results[0].body)).toBeTruthy();
      done();
    });
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

  describe('stringsMatch method:', () => {
    it('test a string with given regexp', () => {
      let reg = new RegExp('test');
      expect(socialScanner.stringsMatch(reg, '<h1>test html content</h1>'));
    });

    it('test a string with given array of regexp', () => {
      let regs = [
        new RegExp('not matching'),
        new RegExp('id="example"')
      ];
      expect(socialScanner.stringsMatch(regs, '<h1 id="example">test html content</h1>'));
    });
  });
});
