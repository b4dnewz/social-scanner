# social-scanner
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
