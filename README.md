# social-scanner
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

A node utility to scan various social networks against username.

## Installation
You can install it as a __global__ module to use the cli-tool:
```bash
npm install -g social-scanner
yarn global add social-scanner
```

## How it works?
The script can be used as a module: 
```javascript
const socialScanner = require('../lib/index');

socialScanner('codekraft-studio', null, (err, response) => {
  if (err) {
    console.log('error:', err);
  }
  console.log('response:', response);
});

```
or as a __cli-tool__ directly:
```bash
Usage: social-scanner [options] <username>
 
  Options:
 
    -V, --version        output the version number
    -o, --output [path]  Where to save the output files
    -h, --help           output usage information

```

[npm-image]: https://badge.fury.io/js/social-scanner.svg
[npm-url]: https://npmjs.org/package/social-scanner
[travis-image]: https://travis-ci.org/b4dnewz/social-scanner.svg?branch=master
[travis-url]: https://travis-ci.org/b4dnewz/social-scanner
[daviddm-image]: https://david-dm.org/b4dnewz/social-scanner.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/b4dnewz/social-scanner
[coveralls-image]: https://coveralls.io/repos/b4dnewz/social-scanner/badge.svg
[coveralls-url]: https://coveralls.io/r/b4dnewz/social-scanner
