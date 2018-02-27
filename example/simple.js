const socialScanner = require('../lib/index');

socialScanner('tzentzen', {
  onlySuccess: true
}, (err, response) => {
  if (err) {
    console.log('Error:', JSON.stringify(err, null, 2));
    return;
  }
  console.log('Response:', JSON.stringify(response, null, 2));
});
