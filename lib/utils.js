'use strict';

const rules = require('./rules');

module.exports = {

  /**
   * Return all the rules used by the scanner
   * this method is intended for public use since omits the filters property
   * @return {array} An array of simplified rule objects
   */
  getRules: () => {
    return rules.map(r => ({
      name: r.name,
      category: r.category,
      url: r.url
    }));
  },

  /**
   * Return the rules array filtered by given array of rule names
   * @return {array} An array of filtered rule objects
   */
  filterRules: restricted => {
    return rules.filter(r => {
      return restricted.includes(r.name);
    });
  },

  /**
   * Test a RegExp or array of RegExps on a string
   * @param  {RegExp|Array<RegExp>} matches A RegExp or an array of RegExp to test
   * @param  {string} str  The the string to test
   * @return {boolean}
   */
  stringsMatch: (matches, str) => {
    if (matches instanceof RegExp) {
      return matches.test(str);
    }
    for (var i = 0; i < matches.length; i++) {
      if (matches[i].test(str)) {
        return true;
      }
    }
  }

};
