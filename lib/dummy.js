'use strict';

const _ = require('lodash');
const fuzzy = require('./fuzzy_find');
const service = require('../lib/service');

const dummyService = service('dummy');

exports.find = (config) => {
  const app = _.get(config, 'app');
  const secret = _.get(config, 'secret');
  const nameOrId = _.get(config, 'dummy') || _.get(config, 'dummyName');

  return fuzzy.search(
    nameOrId,
    'name',
    `${dummyService}/api/v1/dummies`,
    'dummies',
    app,
    secret)
    .then((d) => ({
      dummy: d.id,
      dummyName: _.get(d, 'value'),
      caseId: _.get(d, 'item.caseId'),
      device: _.get(d, 'item.deviceId')
    }));
};
