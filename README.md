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
But you can also use it as a __cli-tool__ here is the usage output from `--help` command:
```
(^_^) SOCIAL-SCANNER

Usage: social-scanner [options] <username>

A node utility to scan various social networks against username.

Options:

  -V, --version                 output the version number
  -o, --output [path]           Where to save the output files
  -c, --capture                 When to take a screenshot of the page
  -t, --timeout [milliseconds]  Milliseconds to wait before killing the screenshot
  -r, --restrict [list]         Comma separated list of social networks to scan
  -h, --help                    output usage information

Commands:

  list [options]   List all the available social networks.
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
The __socia-scanner__ is released under the MIT License.

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
