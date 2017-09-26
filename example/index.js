const socialScanner = require('../lib/index');

socialScanner('codekraft-studio', {
  restrict: ['facebook', 'github', 'bitbucket', 'polyvore'],
  screenshotOptions: {}
}, (err, response) => {
  if (err) {
    console.log('Error:', err);
    return;
  }
  console.log('Response:', response);
});
