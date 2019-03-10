'use strict';

const webScanner = require('./web');
const utils = require('./utils');
const WebpageCapture = require('webpage-capture').default;

/**
 * The main module method than take a target username
 * and perform a deep scan following various rules
 * described in the rules file, optionally applying filters to
 * the username value to match the website schema defined in rule
 * @param  {String}   target       The username to scan for
 * @param  {Object}   options      The scanner options
 * @param  {Function} callback     The callback to execute when everything has done
 */
const scanner = (target, options, callback) => {
  webScanner(target, options, (err, results) => {
    // If results doesn't need to be captured as screenshots
    // just return the results array as it is
    if (!options.capture) {
      return callback(err, results);
    }

    // Prepare the sources to capture
    const sources = results.map(r => r.body || r.address);

    // Update default settings
    const captureOptions = Object.assign({}, options.captureOptions, {
      outputDir: options.outputDir ?
        `${options.outputDir}/${target}` :
        `./output/${target}`
    });

    // Create capturer instance and capture results
    const capturer = new WebpageCapture(captureOptions);
    capturer.capture(sources)
      .then(res => {
        results.map((r, i) => {
          delete r.body;
          r.output = res[i].path;
          return r;
        });

        return capturer.close()
          .then(() => {
            callback(null, results);
          });
      }).catch(err => callback(err));
  });
};

// Export module
module.exports = scanner;

// Export the web scanner with no capture
module.exports.webScanner = webScanner;

// Export method to get module rules
module.exports.getRules = utils.getRules;
