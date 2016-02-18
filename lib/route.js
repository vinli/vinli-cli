'use strict';

const _ = require('lodash');
const fuzzy = require('./fuzzy_find');
const service = require('../lib/service');

const dummyService = service('dummy');

exports.find = (config) => {
  const app = _.get(config, 'app');
  const secret = _.get(config, 'secret');
  const nameOrId = _.get(config, 'route') || _.get(config, 'routeName');
  return fuzzy.search(
    nameOrId,
    'name',
    `${dummyService}/api/v1/routes`,
    'routes',
    app,
    secret).then((r) => ({
      route: r.id,
      routeName: _.get(r, 'value')
    }));
};

exports.assertRoute = (options) => {
  if (!options.route) {
    throw new Error(`Route ID not set.  Set a route ID with a --route parameter.`);
  }
  return options;
};
