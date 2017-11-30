# social-scanner
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

A node utility to scan various social networks against username.

## Installation
You can install it via npm or yarn.
```bash
npm install social-scanner
yarn add social-scanner
```

## Looking for the cli?
You can use it from the command line installing the globally the [cli](https://github.com/b4dnewz/social-scanner-cli) repository.
```bash
npm install -g social-scanner-cli
yarn global add social-scanner-cli
```

## How it works?
The script can be used as a module and take specific options in order:
```javascript
socialScanner(username, options, callback)
```
```javascript
const socialScanner = require('../lib/index');

socialScanner('codekraft-studio', { output: './output' }, (err, response) => {
  if (err) {
    console.log('Error:', err);
    return;
  }
  console.log('Response:', response);
});

```

## Options
* __capture__: Take a page screenshot once has been loaded
* __crop__: If the screnshot should be cropped or not
* __output__: The output file name for the screenshot
* __restrict__: A list (or array) of social networks to scan

## Examples
Scan a username against various social networks, without taking screenshots.
```javascript
socialScanner(username, {}, (err, response) => { });
```

Scan a username against various social networks, taking screenshots.
```javascript
socialScanner(username, {
  capture: true
}, (err, response) => { });
```

Scan username against some restricted social networks.
```javascript
socialScanner(username, {
  restrict: ['facebook', 'github']
}, (err, response) => { });
```

---

## License
The __social-scanner__ is released under the MIT License by [b4dnewz](https://b4dnewz.github.io/).

## Contributing

1. Fork it ( https://github.com/b4dnewz/social-scanner/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
3. Write and run the tests (`npm run test`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

[npm-image]: https://badge.fury.io/js/social-scanner.svg
[npm-url]: https://npmjs.org/package/social-scanner
[travis-image]: https://travis-ci.org/b4dnewz/social-scanner.svg?branch=master
[travis-url]: https://travis-ci.org/b4dnewz/social-scanner
[daviddm-image]: https://david-dm.org/b4dnewz/social-scanner.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/b4dnewz/social-scanner
[coveralls-image]: https://coveralls.io/repos/b4dnewz/social-scanner/badge.svg
[coveralls-url]: https://coveralls.io/r/b4dnewz/social-scanner
