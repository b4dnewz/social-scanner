const socialScanner = require('../lib/index');

socialScanner('b4dnEWZ', {
  restrictCategories: ['community']
}, (err, response) => {
  if (err) {
    console.log('Error:', err);
    return;
  }
  console.log('Response:', response);
});
