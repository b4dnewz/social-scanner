'use strict';

// Script dependencies
const util = require('util');
const async = require('async');
const request = require('request');
const webpageCapture = require('webpage-capture');

// Script rules
const rules = require('./rules');

// Webshot default options
const webshotOptions = {
  outputType: 'base64',
  onlySuccess: false,
  crop: true
};

/**
 * Return all the rules used by the scanner
 * this method is intended for public use since omits the filters property
 * @return {array} An array of rule objects
 */
const getRules = () => {
  return rules.map(r => ({
    name: r.name,
    category: r.category,
    url: r.url
  }));
};

/**
 * Return the rules array filtered by given array of rule names
 * @return {array} An array of rule objects
 */
const filterRules = restricted => {
  return rules.filter(r => {
    return restricted.includes(r.name);
  });
};

/**
 * The main module method than take a target username
 * and perform a deep scan following various rules
 * described in the rules file, optionally applying filters to
 * the username value to match the website schema defined in rule
 * @param  {String}   target       The username to scan for
 * @param  {Object}   [options={}] The scanner options
 * @param  {Function} callback     The callback to execute when everything has done
 */
const scanner = (target, options = {}, callback) => {
  if (!target || target === '') {
    throw new Error('The target parameter is missing.');
  }

  // Init the main variables
  let username = target;

  // Clone the rules array
  let filteredRules = rules.slice(0);

  // Optionally filter the rules with restricted array
  if (Array.isArray(options.restrict) && options.restrict.length > 0) {
    filteredRules = filterRules(options.restrict);
  }

  // Build the request options
  let requestOptions = {
    strictSSL: false,
    followRedirect: true,
    followAllRedirects: false,
    maxRedirects: 2,
    timeout: options.timeout || 3000
  };

  // Run the social scanner for each url
  async.map(filteredRules, (rule, cb) => {
    let usr = username;

    // Optionally apply rule filters for input value
    if (rule.filters && Array.isArray(rule.filters)) {
      rule.filters.forEach(f => {
        usr = f(username);
      });
    }

    // Build the request url using rule format
    let requestUrl = util.format(rule.url, usr);

    // Add current url to global request options
    requestOptions.url = requestUrl;

    // Do the http request
    request(requestOptions, (err, response, body) => {
      let res = {
        name: rule.name,
        category: rule.category,
        value: usr,
        address: requestUrl,
        error: false
      };

      // Check for error in response
      if (err || (response && response.statusCode !== 200)) {
        res.error = {
          status: response ? response.statusCode : null,
          message: response ? response.statusMessage : null,
          error: err
        };
      }

      // Add response body for later use
      if (options.capture) {
        res.body = body;
      }

      cb(null, res);
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
    let captureOptions = Object.assign({}, webshotOptions, options.screenshotOptions || {}, {
      output: options.output ? `${options.output}/${username}` : `./output/${username}`
    });

    // Capture results
    webpageCapture(results, captureOptions, (err, res) => {
      callback(err, res);
    });
  });
};

// Export module
module.exports = scanner;

// Export method to get module rules
module.exports.getRules = getRules;
module.exports.filterRules = filterRules;
