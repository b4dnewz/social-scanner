const assert = require('assert');
const socialScanner = require('../index.js');

describe('socialScanner', () => {
  it('throw an error if nothing has been passed', () => {
    assert.throws(() => socialScanner(''), Error, 'did not throw an error');
  });
});
