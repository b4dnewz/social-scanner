'use strict';

// Script dependencies
const util = require('util');
const mkdirp = require('mkdirp');
const async = require('async');
const webshot = require('webshot');

// Script rules
const rules = require('./rules');

// Social scanner
const scanner = (value, output = null, callback) => {
  // Exit if no input value
  if (!value || value === '') {
    throw new Error('The value parameter is missing.');
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
