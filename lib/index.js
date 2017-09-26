'use strict';

// Script dependencies
const util = require('util');
const async = require('async');
const request = require('request');
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
  const username = target;

  // Optionally restrict the rules number
  if (Array.isArray(options.restrict) && options.restrict.length > 0) {
    rules = rules.filter(r => {
      return options.restrict.indexOf(r.name) > -1;
    });
  }

  // Run the social scanner for each url
  async.mapSeries(rules, (item, mapCallback) => {

    // Assign the username value to tmp variable
    let usr = username;

    // If item filters exists apply all of them to the input
    if (Array.isArray(item.filters)) {
      item.filters.forEach(f => {
        usr = f(username);
      });
    }

    // Build the url
    const url = util.format(item.url, usr);

    // Do the http request
    request(url, (err, response, body) => {

      // Exit on request error
      if( err || (response && response.statusCode !== 200) ) {
        mapCallback(null, {
          name: item.name,
          error: {
            status: response ? response.statusCode : null,
            message: response ? response.statusMessage : null,
            error: err
          }
        });
        return;
      }

      // Optionally take the page screenshot
      if( options.capture ) {

        // Update default settings
        webshotOptions = Object.assign(webshotOptions, options.screenshotOptions || {});

        // Build output folder path based on username input
        const outputFolder = options.output ? `${options.output}/${username}` : `./output/${username}`;

        // Build screenshot output path
        const screenshotPath = `${outputFolder}/${item.name}.png`;

        // Merge rule options with default and user defined
        const screenshotOptions = Object.assign(item.options || {}, webshotOptions);

        // Open and render as html string
        screenshotOptions.siteType = 'html';

        // Get the page screenshot
        webpageCapture(url, options, (err, res) => {
          mapCallback(null, {
            name: item.name,
            error: {
              status: response.statusCode || null,
              message: response.statusMessage || null,
              error: err
            },
            output: err ? null : res
          });
        });

      } else {

        mapCallback(null, {
          name: item.name,
          error: false
        });

      }

  }, (err, results) => {
    callback(err, results);
  });
};

// Export module
module.exports = scanner;
