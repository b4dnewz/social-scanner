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
  outputType: 'base64',
  onlySuccess: false,
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
  async.map(rules, (item, cb) => {
    // Assign the username value to tmp variable
    let usr = username;

    // Optionally apply rule filters
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
      if (err || (response && response.statusCode !== 200)) {
        cb(null, {
          name: item.name,
          error: {
            status: response ? response.statusCode : null,
            message: response ? response.statusMessage : null,
            error: err
          }
        });
        return;
      }
      cb(null, {
        name: item.name,
        error: false,
        body: body
      });
    });

  // Once all the requests are done process with the Script
  // optionally begin to capture each results
  }, (err, results) => {
    // If results doesn't need to be captured as screenshots
    // just return the results array as it is
    if (!options.capture) {
      return callback(err, results);
    }

    // Update default settings
    webshotOptions = Object.assign(webshotOptions, options.screenshotOptions || {}, {
      output: options.output ? `${options.output}/${username}` : `./output/${username}`
    });

    // Capture results
    webpageCapture(results, webshotOptions, (err, res) => {
      callback(err, res);
    });
  });
};

// Export module
module.exports = scanner;
