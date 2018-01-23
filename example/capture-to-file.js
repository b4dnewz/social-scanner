const socialScanner = require('../lib/index');

socialScanner('codekraft-studio', {
  restrict: ['github'],
  capture: true,
  screenshotOptions: {
    onlySuccess: false,
    outputType: 'file'
  }
}, (err, response) => {
  if (err) {
    console.log('Error:', err);
    return;
  }
  console.log('Response:', response);
});
