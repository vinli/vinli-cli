'use strict';

const _ = require('lodash');
const moment = require('moment');

const RELATIVE_REGEX
  = /^[0-9]+ (sec(cond)?s?|min(ute)?s?|h(ou)?rs?|days?|w(ee)?ks?|mon(th)?s?|y(ea)?rs?) ago$/;

const TIME_UNIT_MAP = [{
  regex: /^sec(cond)?s?$/,
  unit: 'seconds'
}, {
  regex: /^min(ute)?s?$/,
  unit: 'minutes'
}, {
  regex: /^h(ou)?rs?$/,
  unit: 'hours'
}, {
  regex: /^days?$/,
  unit: 'days'
}, {
  regex: /^w(ee)?ks?$/,
  unit: 'weeks'
}, {
  regex: /^mon(th)?s?$/,
  unit: 'months'
}, {
  regex: /^y(ea)?rs?$/,
  unit: 'years'
}];

const isRelative = (str) => {
  return RELATIVE_REGEX.test(str);
};

const convertUnit = (unit) => {
  return _.find(TIME_UNIT_MAP, (item) => item.regex.test(unit)).unit;
};

const convertRelative = (time) => {
  if (!isRelative(time)) {
    return time;
  }

  const tokens = time.split(' ');
  const tr = moment();
  tr.subtract(parseInt(tokens[0]), convertUnit(tokens[1]));

  return tr.format();
};

exports.convertSince = (program) => {
  const time = _.get(program, 'since', new Date(0).toISOString());

  return convertRelative(time);
};

exports.convertUntil = (program) => {
  const time = _.get(program, 'until', new Date().toISOString());

  return convertRelative(time);
};
