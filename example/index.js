const socialScanner = require('../lib/index');

socialScanner('codekraft-studio', {
  restrict: ['github', 'bitbucket', 'polyvore'],
  screenshotOptions: {}
}, (err, response) => {
  if (err) {
    console.log('Error:', err);
    return;
  }
  console.log('Response:', response);
});
