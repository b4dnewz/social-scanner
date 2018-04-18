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
const requestOptions = {
  strictSSL: false,
  followRedirect: true,
  followAllRedirects: false,
  maxRedirects: 2,
  timeout: 3000
};

/**
 * Request the given url and return modified response
 */
const testRule = (url, rule, options) => {
  return new Promise((resolve, reject) => {
    rule.requestOptions = rule.requestOptions || {};
    let reqOpts = Object.assign({}, options.requestOptions, rule.requestOptions, {url});
    request(reqOpts, (err, res, body) => {
      if (err || (res && res.statusCode !== 200)) {
        return reject({
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
      if (rule.matches && utils.stringsMatch(rule.matches, body) === false) {
        return reject({status: 200, message: 'Page content does not match rule regexp.', error: 'NOMATCH'});
      }

      resolve(body);
    });
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
  const username = target;
  let filteredRules = rules.slice(0);

  // Extend the default HTTP request options
  options.requestOptions = Object.assign({}, requestOptions, options.requestOptions || {});

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
    let input = username;

    // Optionally apply rule filters for input value
    if (rule.filters && Array.isArray(rule.filters)) {
      rule.filters.forEach(f => {
        input = f(username);
      });
    }

    // #8 Support for multiple url in rules
    if (Array.isArray(rule.url)) {
      async.map(rule.url, (url, callback) => {
        let address = util.format(url, input);
        testRule(address, rule, options).then(body => {
          callback(null, {
            address: address,
            error: false,
            body: body
          });
        }).catch(err => callback(null, {
          address: address,
          error: err
        }));
      }, (err, results) => {
        cb(err, {
          name: rule.name,
          category: rule.category,
          value: input,
          address: results.map(r => r.address),
          error: results.some(r => r.error) ?
            results.map(r => r.error)
            // Filter null values
              .filter(r => r) :
            null,
          body: options.capture ?
            results.map(r => r.body) :
            null
        });
      });
    } else {
      let address = util.format(rule.url, input);
      testRule(address, rule, options).then(body => {
        cb(null, {
          name: rule.name,
          category: rule.category,
          value: input,
          address: address,
          error: false,
          body: options.capture ?
            body :
            null
        });
      }).catch(err => {
        cb(null, {
          address: address,
          error: err
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
      outputDir: options.output ?
        `${options.output}/${username}` :
        `./output/${username}`
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
