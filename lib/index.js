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

// The default HTTP request options
var requestOptions = {
  strictSSL: false,
  followRedirect: true,
  followAllRedirects: false,
  maxRedirects: 2,
  timeout: 3000
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
 * Request the given url and return modified response
 */
const testUrl = (url, options, callback) => {
  // Build req options
  let reqOpts = Object.assign({}, requestOptions, options, {url});

  // Do the http request
  request(reqOpts, (err, res, body) => {
    if (err || (res && res.statusCode !== 200)) {
      return callback({
        status: res ? res.statusCode : null,
        message: res ? res.statusMessage : null,
        error: err
      });
    }
    callback(null, body);
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

  // Optionally extend the HTTP request options
  if (options.requestOptions) {
    requestOptions = Object.assign(requestOptions, options.requestOptions);
  }

  // Run the social scanner for each url
  async.map(filteredRules, (rule, cb) => {
    let usr = username;

    // Optionally apply rule filters for input value
    if (rule.filters && Array.isArray(rule.filters)) {
      rule.filters.forEach(f => {
        usr = f(username);
      });
    }

    // #8 Support for multiple url in rules
    if (Array.isArray(rule.url)) {
      // For each url perform a request
      async.map(rule.url, (url, callback) => {
        let address = util.format(url, usr);
        testUrl(address, rule.requestOptions || {}, (err, body) => {
          callback(null, {
            address,
            error: err,
            body
          });
        });
      }, (err, results) => {
        cb(err, {
          name: rule.name,
          category: rule.category,
          value: usr,
          address: results.map(r => r.address),
          error: results.some(r => r.error) ?
            results
              .map(r => r.error)
              // Filter null values
              .filter(r => r) :
            null,
          body: options.capture ? results.map(r => r.body) : null
        });
      });
    } else {
      // Build the request url using rule format
      let reqUrl = util.format(rule.url, usr);
      testUrl(reqUrl, rule.requestOptions || {}, (err, body) => {
        cb(null, {
          name: rule.name,
          category: rule.category,
          value: usr,
          address: reqUrl,
          error: err,
          body: options.capture ? body : null
        });
      });
    }

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
