'use strict';

// Script dependencies
const util = require('util');
const async = require('async');
const webshot = require('webshot');

// Script rules
let rules = require('./rules');

// Webshot default options
let webshotOptions = {
  timeout: 10000,
  errorIfStatusIsNot200: true,
  // BUG: When this option is enabled fires the bug: "Callback was already called."
  // ErrorIfJSException: true,
  windowSize: {
    width: 1280,
    height: 800
  }
};

// Social scanner
const scanner = (target, options = {}, callback) => {
  // Exit if no input target
  if (!target || target === '') {
    throw new Error('The target parameter is missing.');
  }

  // Get variables
  const username = target;
  const outputFolder = options.output ? `${options.output}/${username}` : `./output/${username}`;

  // Update default settings
  webshotOptions = Object.assign(webshotOptions, options.screenshotOptions || {});

  // Optionally restrict the rules number
  if (Array.isArray(options.restrict) && options.restrict.length > 0) {
    rules = rules.filter(r => {
      return options.restrict.indexOf(r.name) > -1;
    });
  }

  // Run the social scanner for each url
  async.mapSeries(rules, (item, mapCallback) => {
    // Build the url
    const url = util.format(item.url, username);

    // Build screenshot output path
    const screenshotPath = `${outputFolder}/${item.name}.png`;

    // Merge rule options with default and user defined
    const options = Object.assign(item.options || {}, webshotOptions);

    // Get the page screenshot
    webshot(url, screenshotPath, options, err => {
      mapCallback(null, {
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
