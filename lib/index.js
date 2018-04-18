'use strict';

// Script dependencies
const util = require('util');
const utils = require('./utils');
const async = require('async');
const request = require('request');
const webpageCapture = require('webpage-capture');

// The rules define how the request and the response
// should look with output regex validation or request http options
// also formats the user input and cleans it in case of characters restrictions
const rules = require('./rules');

// The default options passed to webpage-capture module in case of rendering
const webCaptureOptions = {
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
 * Request the given url and return modified response
 */
const testRule = (url, rule, callback) => {
  let reqOpts = Object.assign({}, requestOptions, rule.requestOptions || {}, {url});

  // Do the http request
  request(reqOpts, (err, res, body) => {
    if (err || (res && res.statusCode !== 200)) {
      return callback({
        status: res ?
          res.statusCode :
          null,
        message: res ?
          res.statusMessage :
          null,
        error: err
      });
    }

    // Optionally perform additional checks
    // for example multiple regex test on response body
    if (rule.matches) {
      if (utils.stringsMatch(rule.matches, body)) {
        callback(null, body);
      } else {
        callback({status: 200, message: 'Rule does not match.', error: 'NOTMATCH'});
      }
    } else {
      callback(null, body);
    }
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

  // Prepare variables
  let username = target;
  let filteredRules = rules.slice(0);

  // Optionally extend the HTTP request options
  if (options.requestOptions) {
    requestOptions = Object.assign(requestOptions, options.requestOptions);
  }

  // Optionally filter by rule categories
  if (Array.isArray(options.restrictCategories) && options.restrictCategories.length > 0) {
    filteredRules = rules.filter(r => {
      if (!r.category || !Array.isArray(r.category)) {
        return false;
      }
      for (var i = 0; i < r.category.length; i++) {
        if (options.restrictCategories.includes(r.category[i])) {
          return true;
        }
      }
      return false;
    });
  }

  // Optionally filter the rules with restricted array
  if (Array.isArray(options.restrict) && options.restrict.length > 0) {
    filteredRules = utils.filterRules(options.restrict);
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
        testRule(address, rule, (err, body) => {
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
      let reqUrl = util.format(rule.url, usr);
      testRule(reqUrl, rule, (err, body) => {
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
  }, (err, results) => {
    if (options.onlySuccess) {
      results = results.filter(r => !r.error);
    }

    // If results doesn't need to be captured as screenshots
    // just return the results array as it is
    if (!options.capture) {
      return callback(err, results);
    }

    // Update default settings
    let captureOptions = Object.assign({}, webCaptureOptions, options.screenshotOptions || {}, {
      outputDir: options.output ? `${options.output}/${username}` : `./output/${username}`
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
module.exports.getRules = utils.getRules;
