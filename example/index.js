const socialScanner = require('../lib/index');

socialScanner('codekraft-studio', null, {}, (err, response) => {
  if (err) {
    console.log('Error:', err);
  }
  console.log('Response:', response);
});
