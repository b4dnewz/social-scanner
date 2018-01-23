const socialScanner = require('../lib/index');

socialScanner('codekraft-studio', {}, (err, response) => {
  if (err) {
    console.log('Error:', JSON.stringify(err, null, 2));
    return;
  }
  console.log('Response:', JSON.stringify(response, null, 2));
});
