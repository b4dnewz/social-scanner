'use strict';

// Script dependencies
const pkg = require('../package.json')
const util = require('util');
const mkdirp = require('mkdirp');
const async = require('async');
const webshot = require('webshot');
const commander = require('commander');

// Script rules
const rules = require('./rules');

// Social scanner
const scanner = (value, output = null, callback) => {
  // Exit if no input value
  if (!value || value === '') {
    console.error('The script will not work without a value to check.');
    return;
  }

  // TODO: Sanitize value and apply some variants ?
  const username = value;
  const outputFolder = output ? `${output}/${username}` : `./output/${username}`;

  // Create the output folder
  mkdirp(outputFolder);

  // Run the social scanner for each url
  async.map(rules, (item, callback) => {
    // Build the url
    const url = util.format(item.url, username);

    // Build screenshot output path
    const screenshotPath = `${outputFolder}/${item.name}.png`;
    const screenshotOptions = {
      timeout: 5000, // Number of milliseconds to wait before killing the phantomjs
      errorIfStatusIsNot200: true
    };

    // Get the page screenshot
    webshot(url, screenshotPath, screenshotOptions, err => {
      if (err) {
        callback(null, {
          name: item.name,
          error: err
        });
        return;
      }

      callback(null, {
        name: item.name,
        error: err,
        output: screenshotPath
      });
    });
  }, (err, results) => {
    callback(null, results);
  });
};

// Export module
module.exports = scanner;

// If is called directly from command line
if (require.main === module) {

  commander
    .version(pkg.version)
    .usage('[options] <username>')
    .arguments('<username>')
    .option('-o, --output [path]', 'Where to save the output files')
    .action((username) => {
      // Run the scanner
      scanner(username, commander.output, (err, results) => {
        console.log('Scanned', results.length, 'social networks.');
      });
    })
    .parse(process.argv);

}
