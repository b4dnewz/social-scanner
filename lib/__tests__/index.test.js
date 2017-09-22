const assert = require('assert');
const socialScanner = require('../index.js');

describe('socialScanner', () => {
  it('exports by default a function', () => {
    assert.equal(typeof socialScanner, 'function', 'it should export a function');
  });
  it('throw an error if nothing has been passed', () => {
    assert.throws(() => socialScanner(''), Error, 'did not throw an error');
  });
});
