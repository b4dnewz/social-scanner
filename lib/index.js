'use strict';

// Script dependencies
const util = require('util');
const async = require('async');
const webpageCapture = require('webpage-capture');

// Script rules
let rules = require('./rules');

// Webshot default options
let webshotOptions = {
  onlySuccess: true,
  crop: true
};

// Social scanner
const scanner = (target, options = {}, callback) => {
  // Exit if no input target
  if (!target || target === '') {
    throw new Error('The target parameter is missing.');
  }

  // Init the main variables
  let username = target;
  let outputFolder = options.output ? `${options.output}/${username}` : `./output/${username}`;

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
    // Build screenshot output path
    const screenshotPath = `${outputFolder}/${item.name}.png`;

    // Merge rule options with default and user defined
    const options = Object.assign(item.options || {}, webshotOptions, {
      output: screenshotPath
    });

    // If item filters exists apply all of them to the input
    if (Array.isArray(item.filters)) {
      item.filters.forEach(f => {
        username = f(username);
      });
    }

    // Build the url
    const url = util.format(item.url, username);

    // Get the page screenshot
    console.log('Request for url:', url);
    webpageCapture(url, options, (err, res) => {

      console.log('Erro happen?', err);

      console.log('Screenshot created at path:', res);
      mapCallback(null, {
        name: item.name,
        error: err instanceof Error,
        output: err instanceof Error ? null : screenshotPath
      });
    });
  }, (err, results) => {
    callback(err, results);
  });
};

// Export module
module.exports = scanner;
