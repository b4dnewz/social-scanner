![banner](./banner.jpg)

<p align="center">
  <a href="https://npmjs.org/package/social-scanner"><img src="https://badge.fury.io/js/social-scanner.svg"></a>
  <a href="https://travis-ci.org/b4dnewz/social-scanner"><img src="https://travis-ci.org/b4dnewz/social-scanner.svg?branch=master"></a>
  <a href="https://david-dm.org/b4dnewz/social-scanner"><img src="https://david-dm.org/b4dnewz/social-scanner.svg?theme=shields.io"></a>
  <a href="https://coveralls.io/r/b4dnewz/social-scanner"><img src="https://coveralls.io/repos/b4dnewz/social-scanner/badge.svg"></a>
  <a href="https://snyk.io/test/github/b4dnewz/social-scanner"><img src="https://snyk.io/test/github/b4dnewz/social-scanner/badge.svg"></a>
</p>

<p align="center">node utility to scan various social networks to match a username</p>

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
By default it will perform an HTTP request for each rule to test the given username.
```javascript
const socialScanner = require('../lib/index');

socialScanner('codekraft-studio', {}, (err, response) => {
  if (err) {
    console.log('Error:', JSON.stringify(err, null, 2));
    return;
  }
  console.log('Response:', JSON.stringify(response, null, 2));
});
```
You can also capture the output in two different formats, by default is BASE64 encoded PNG for web use, bu with the __screenshotOptions__ option you can specity to output to a file:
```javascript
socialScanner('codekraft-studio', {
  capture: true,
  screenshotOptions: {
    onlySuccess: true,
    outputType: 'file'
  }
}, (err, response) => {
  // some code
});
```
To specify a custom path for the files you must pass it to __output__ option like so:
```javascript
socialScanner('codekraft-studio', {
  capture: true,
  output: '/home/user/Desktop'
});
```


## Options
* __capture__: Take a page screenshot once has been loaded
* __crop__: If the screnshot should be cropped or not
* __onlySuccess__: Returns only results that matched the search
* __output__: The output file name for the screenshot
* __restrict__: A list (or array) of social networks to scan
* __restrictCategories__: An array of restrict rule categories
* __requestOptions__: A object of options passed to [request](https://github.com/request/request)
* __screenshotOptions__: A object of options passed to [webpage-capture](https://github.com/b4dnewz/webpage-capture)

## Examples
Scan a username against various social networks, without taking screenshots.
```javascript
socialScanner(username, {}, (err, response) => { });
```

Scan a username against various social networks, taking screenshots.
```javascript
socialScanner(username, {
  capture: true,
  onlySuccess: true
}, (err, response) => { });
```

Scan username against some restricted social networks.
```javascript
socialScanner(username, {
  restrict: ['facebook', 'github']
}, (err, response) => { });
```

Scan username against some restricted social categories.
```javascript
socialScanner(username, {
  restrictCategories: ['community']
}, (err, response) => { });
```
You can find more examples and the full code in the [example](https://github.com/b4dnewz/social-scanner/tree/master/example) folder.

---

## Adding rules
So you want to add a rule or a set of rules to the tool? Maybe you have tried it with your username and you haven't find listed your favorite social network or web service. There is a solution for this, simply open a [new issue](https://github.com/b4dnewz/social-scanner/issues/new?title=Rule+request&labels=enhancement&template=new_rule.md) asking what service you want to add and it will be integrated as soon as possible in the next releases.

#### What I need to know?
For example you want to integrate you favourite social network which is called `example.com` and you know the profile pages for that website are under the path: `example.com/profile/<my-username>`, you also know this website doesn't allow some kind of characters for usernames, because during the registration process you have tried many different wrong usernames.

#### How to integrate?
Now you can open a [new issue](https://github.com/b4dnewz/social-scanner/issues/new?title=Rule+request&labels=enhancement&template=new_rule.md) following the template and describing as much as you can the website you want to add or you can fork the repository and add the rule yourself, take a look at the [rules](https://github.com/b4dnewz/social-scanner/blob/master/lib/rules.js) file than add your new rule object and submit a pull request.

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
