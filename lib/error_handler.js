'use strict';

const colors = require('colors/safe');
const _ = require('lodash');

module.exports = function(err) {
  if (_.has(err, 'statusCode')) {
    console.log(`\nServer could not process request:\n`);

    const color = parseInt(err.statusCode) < 500 ? 'yellow' : 'red';
    const errorLabel = _.has(err, 'data.error')
      ? colors[color].bold(`${err.statusCode} ${err.data.error}`)
      : colors[color].bold(`${err.statusCode}`);

    const message = _.get(err, 'data.message') || 'Unspecified error';
    console.log(`  ${errorLabel} - ${message}\n`);

    process.exit(1);
  }

  console.log(colors.red(err.message || err));
};
