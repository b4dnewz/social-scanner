#!/usr/bin/env node

'use strict';

const pkg = require('../package.json');
const scanner = require('./index.js');
const commander = require('commander');

console.log(`\n\n  (^_^) SOCIAL-SCANNER  `);

// Setup commander
commander
  .version(pkg.version)
  .name(pkg.name)
  .description('A node utility to scan various social networks against username.')
  .usage('[options] <username>')
  .arguments('<username>')
  .option('-o, --output [path]', 'Where to save the output files')
  .option('-t, --timeout [milliseconds]', 'Milliseconds to wait before killing the screenshot')
  .option('-r, --restrict [items]', 'Comma separated list of social networks to scan', val => val.split(','), [])
  .action(username => {
    console.log('\n  Scanning for:', username);
    // Run the scanner
    scanner(username, commander.output, {}, (err, results) => {
      if (err) {
        console.log('An error occurred while scanning:', err);
        return;
      }
      console.log('  Scanned', results.length, 'social networks.\n');
      process.exit();
    });
  })
  .parse(process.argv);
