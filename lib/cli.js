#!/usr/bin/env node

'use strict';

const pkg = require('../package.json');
const scanner = require('./index.js');
const rules = require('./rules.js');
const commander = require('commander');

// Print the banner
console.log(`\n  (^_^) SOCIAL-SCANNER \n`);

// Main command
commander
  .version(pkg.version)
  .name(pkg.name)
  .description('A node utility to scan various social networks against username.')
  .usage('[options] <username>')
  .arguments('<username>')
  .option('-o, --output [path]', 'Where to save the output files')
  .option('-t, --timeout [milliseconds]', 'Milliseconds to wait before killing the screenshot')
  .option('-r, --restrict [list]', 'Comma separated list of social networks to scan', val => val.split(','), [])
  .action(username => {
    console.log('Scanning for:', username);
    // Run the scanner
    scanner(username, {
      output: commander.output,
      restrict: commander.restrict
    }, (err, results) => {
      if (err) {
        console.log('An error occurred while scanning:', err);
        return;
      }
      console.log('  Scanned', results.length, 'social networks.\n');
      process.exit();
    });
  });

// Print all the available rule entries
commander
  .command('list')
  .description('List all the available social networks.')
  .option('-g, --groups [list]', 'Comma separated list of social networks groups', val => val.split(','), [])
  .action(options => {
    // Group rules by category property
    const groupedRules = rules.reduce(function (rv, x) {
      (rv[x.category] = rv[x.category] || []).push(x);
      return rv;
    }, {});

    let resultGroups = Object.assign({}, groupedRules);

    // Filter groups to return only ones that match
    if (Array.isArray(options.groups) && options.groups.length > 0) {
      resultGroups = {};
      options.groups.forEach(g => {
        if (Object.prototype.hasOwnProperty.call(groupedRules, g)) {
          resultGroups[g] = groupedRules[g];
        }
      });
    }

    console.log('There are', rules.length, 'total rules right now in', Object.keys(groupedRules).length, 'categories.\n');

    // Print the grouped rules
    Object.keys(resultGroups).forEach(function (key) {
      let groupRules = resultGroups[key];
      console.log('Category:', key);
      console.log('===========================\n');
      groupRules.forEach(r => {
        console.log('- Name:', r.name);
        console.log('  Url:', r.url, '\n');
      });
    });
  });

// Parse arguments
commander.parse(process.argv);
