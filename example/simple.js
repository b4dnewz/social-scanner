const socialScanner = require('../lib/index');

socialScanner('b4dnEWZ', {
  requestOptions: {
    timeout: 1000
  },
  restrict: ['github']
}, (err, response) => {
  if (err) {
    console.log('Error:', err);
    return;
  }
  console.log('Response:', JSON.stringify(response, null, 2));
});
