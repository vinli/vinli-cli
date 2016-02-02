'use strict';

const _ = require('lodash');
const fuzzy = require('./fuzzy_find');

exports.isId = (nameOrId) => /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/.test(nameOrId);

exports.find = (config, apps) => {
  const nameOrId = _.get(config, 'app');
  const renderApp = (a) => ({
    app: a.id,
    secret: a.secret,
    appName: a.name
  });

  if (exports.isId(nameOrId)) {
    const matchById = _.head(_.filter(apps, _.matches({ id: nameOrId })));
    if (matchById) {
      return renderApp(matchById);
    }
    throw new Error('Unable to find app with that ID');
  }
  const matchByName = _.head(_.filter(apps, _.matches({ name: nameOrId })));
  if (matchByName) {
    return renderApp(matchByName);
  }

  return renderApp(fuzzy.searchArray(nameOrId, apps, 'name'));
};
