const fs = require('fs');
const utils = require('../lib/utils');
const socialScanner = require('../lib/index');

describe('socialScanner', () => {
  it('exports by default a function', () => {
    expect(typeof socialScanner).toBe('function');
  });

  it('throw an error if target is empty', () => {
    expect(() => {
      socialScanner('');
    }).toThrow();
  });

  it('scan only rules in given categories', done => {
    socialScanner('b4dnewz', {
      onlySuccess: true,
      restrictCategories: ['tech']
    }, (err, results) => {
      expect(err).toBeNull();
      expect(results).not.toBeNull();
      results.forEach(r => expect(r.category.includes('tech')));
      results.forEach(r => expect(r.error).toBeFalsy());
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

  it('set a error property with the error details and message', done => {
    socialScanner('b4dnewz', {
      capture: false,
      restrict: ['ebay']
    }, (err, results) => {
      expect(err).toBeNull();
      expect(results).not.toBeNull();
      expect(typeof results[0]).toBe('object');
      expect(results[0].error).toMatchObject({
        status: 200,
        message: 'Page content does not match rule regexp.',
        error: 'NOMATCH'
      });
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

  it('capture the result to a file', done => {
    socialScanner('b4dnewz', {
      restrict: ['github'],
      capture: true,
      captureOptions: {
        onlySuccess: false
      }
    }, (err, results) => {
      expect(err).toBeNull();
      expect(results[0]).toHaveProperty('output');
      expect(() => {
        fs.existsSync(results[0].output);
        fs.unlinkSync(results[0].output);
      }).not.toThrow();
      done();
    });
  });

  describe('utils methods', () => {
    it('getRules returns an array of object rules', () => {
      let res = socialScanner.getRules();
      expect(Array.isArray(res)).toBeTruthy();
      expect(typeof res[0]).toBe('object');
    });

    it('filterRules returns an array of filtered rules', () => {
      let res = utils.filterRules(['github']);
      expect(Array.isArray(res)).toBeTruthy();
      expect(typeof res[0]).toBe('object');
      expect(res[0].name).toBe('github');
    });

    it('stringsMatch test a string with given regexp', () => {
      let reg = new RegExp('test');
      expect(utils.stringsMatch(reg, '<h1>test html content</h1>'));
    });

    it('stringsMatch test a string with given array of regexp', () => {
      let regs = [
        new RegExp('not matching'),
        new RegExp('id="example"')
      ];
      expect(utils.stringsMatch(regs, '<h1 id="example">test html content</h1>'));
    });
  });
});
