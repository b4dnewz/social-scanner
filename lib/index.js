'use strict';

// Script dependencies
const util = require('util');
const mkdirp = require('mkdirp');
const async = require('async');
const webshot = require('webshot');

// Script rules
const rules = require('./rules');

// Webshot default options
let screenshotOptions = {
  Timeout: 10000,
  errorIfStatusIsNot200: true,
  windowSize: {
    width: 1280,
    height: 800
  }
};

// Social scanner
const scanner = (value, output = null, webshotOptions = {}, callback) => {
  // Exit if no input value
  if (!value || value === '') {
    throw new Error('The value parameter is missing.');
  }

  // Get variables
  const username = value;
  const outputFolder = output ? `${output}/${username}` : `./output/${username}`;

  // Update default settings
  screenshotOptions = Object.assign(screenshotOptions, webshotOptions);

  // Create the output folder
  mkdirp(outputFolder);

  // Run the social scanner for each url
  async.map(rules, (item, cb) => {
    // Build the url
    const url = util.format(item.url, username);

    // Build screenshot output path
    const screenshotPath = `${outputFolder}/${item.name}.png`;

    // Merge rule options with default and user defined
    const options = Object.assign(item.options || {}, screenshotOptions);

    // Get the page screenshot
    webshot(url, screenshotPath, options, err => {
      cb(null, {
        name: item.name,
        error: err !== null,
        output: err === null ? screenshotPath : false
      });
    });
  }, (err, results) => {
    callback(err, results);
  });
};

// Export module
module.exports = scanner;
