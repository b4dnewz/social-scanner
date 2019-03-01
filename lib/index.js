'use strict';

// Script dependencies
const util = require('util');
const utils = require('./utils');
const async = require('async');
const request = require('request');
const WebpageCapture = require('webpage-capture').default;

// The rules define how the request and the response
// should look with output regex validation or request http options
// also formats the user input and cleans it in case of characters restrictions
const rules = require('./rules');

const defaultOptions = {
  timeout: 3000,
  onlySuccess: false,
  capture: false,
  screenshotOptions: {
    outputType: 'base64',
    onlySuccess: false,
    crop: true
  }
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

    let reqOpts = Object.assign(
      {},
      options.requestOptions,
      rule.requestOptions,
      {url}
    );
    request(reqOpts, (err, res, body) => {
      if (err) {
        return reject({
          status: res.statusCode,
          message: err.message,
          error: err
        });
      }

      // Reject non success codes
      if (res.statusCode !== 200) {
        return reject({
          status: res.statusCode,
          message: res.statusMessage,
          error: err
        });
      }

      // Optionally perform additional checks
      // for example multiple regex test on response body
      if (rule.matches && utils.stringsMatch(rule.matches, body) === false) {
        return reject({
          status: res.statusCode,
          message: 'Page content does not match rule regexp.',
          error: 'NOMATCH'
        });
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

  // Extend options with default settings
  options = Object.assign({}, defaultOptions, options);

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

  // Optionally filter the rules within restricted array
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
          body: body
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

    const sources = results
      .filter(r => r.body)
      .map(r => r.body);

    // Update default settings
    const captureOptions = Object.assign({}, options.screenshotOptions, {
      timeout: options.timeout,
      outputDir: options.outputDir ?
        `${options.outputDir}/${username}` :
        `./output/${username}`
    });

    // Capture results
    const capturer = new WebpageCapture(captureOptions);
    capturer.capture(sources)
      .then(res => {
        results.map((r, i) => {
          r.output = res[i].path;
          return r;
        });
        return capturer.close()
          .then(() => {
            callback(null, results);
          });
      }).catch(callback);
  });
};

// Export module
module.exports = scanner;

// Export method to get module rules
module.exports.getRules = utils.getRules;
