'use strict';

const util = require('util');
const utils = require('./utils');
const async = require('async');
const https = require('https');
const axios = require('axios');
const request = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

const {
  defaultOptions
} = require('./config');

// The rules define how the request and the response
// should look with output regex validation or request http options
// also formats the user input and cleans it in case of characters restrictions
const rules = require('./rules');

/**
 * Custom no match error
 */
function NoMatchException(message) {
  this.name = 'NOMATCH';
  this.message = message;
  this.response = {
    status: 200
  };
}

/**
 * Get the given url, optionally test rule matches
 * than resolve with the response body
 */
function execute(url, rule, options) {
  return new Promise((resolve, reject) => {
    const reqOpts = Object.assign({},
      options.requestOptions,
      rule.requestOptions || {}, {
        url
      }
    );

    request(reqOpts)
      .then(response => {
        const body = response.data;

        // Optionally perform additional checks
        // for example multiple regex test on response body
        if (rule.matches && utils.stringsMatch(rule.matches, body) === false) {
          throw new NoMatchException('Page content does not match rule regexp.');
        }

        resolve(body);
      }).catch(err => reject({
        status: err.response && err.response.status,
        message: err.message,
        error: err.name
      }));
  });
}

/**
 * The main module method than take a target username
 * and perform a deep scan following various rules
 * described in the rules file, optionally applying filters to
 * the username value to match the website schema defined in rule
 * @param  {String}   target       The username to scan for
 * @param  {Object}   options      The scanner options
 * @param  {Function} callback     The callback to execute when everything has done
 */
module.exports = function (target, options, callback) {
  if (!target || target === '') {
    throw new Error('The target parameter is missing.');
  }

  // Prepare variables
  const username = target;
  let filteredRules = rules.slice(0);

  // Extend options with default settings
  options = Object.assign({}, defaultOptions, options);

  // Extend the default HTTP request options
  options.requestOptions = Object.assign({}, defaultOptions.requestOptions, options.requestOptions || {});

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
        execute(address, rule, options)
          .then(body => callback(null, {
            address: address,
            error: false,
            body: body
          }))
          .catch(err => callback(null, {
            address: address,
            error: err
          }));
      }, (err, results) => {
        cb(err, {
          name: rule.name,
          category: rule.category,
          value: input,
          address: results.map(r => r.address),
          error: results.some(r => r.error) &&
            results.map(r => r.error).filter(r => r),
          body: options.capture && results.map(r => r.body)
        });
      });
    } else {
      let address = util.format(rule.url, input);
      execute(address, rule, options)
        .then(body => cb(null, {
          name: rule.name,
          category: rule.category,
          value: input,
          address: address,
          error: false,
          body: options.capture && body
        }))
        .catch(err => cb(null, {
          address: address,
          error: err
        }));
    }
  }, (err, results) => {
    if (options.onlySuccess) {
      results = results.filter(r => !r.error);
    }

    callback(err, results);
  });
};
