'use strict';

const _ = require('lodash');
const Levenshtein = require('Levenshtein');
const yarp = require('yarp');

exports.isId = (nameOrId) => /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/.test(nameOrId);

exports.search = (nameOrId, field, url, listLabel, appId, secretKey) => {
  return yarp({
    url: url,
    qs: {
      limit: 100
    },
    auth: {
      user: appId,
      pass: secretKey
    }
  }).then((resp) => {
    const distances = _.map(resp[listLabel], (item) => {
      const lev = new Levenshtein(item[field], nameOrId);
      return {
        id: item.id,
        value: item[field],
        distance: lev.distance,
        item: item
      };
    });
    if (exports.isId(nameOrId)) {
      const matchById = _.head(_.filter(distances, _.matches({ id: nameOrId })));
      if (matchById) {
        return matchById;
      }
      throw new Error(`No ID match for ${nameOrId}`);
    }

    const startsWith = _.filter(distances, (d) => d.value.search(nameOrId) === 0);
    if (startsWith.length === 1) {
      return startsWith[0];
    }

    return _.first(_.sortBy(distances, 'distance'));
  });
};

exports.searchArray = (name, array, field) => {
  const n = name.toLowerCase();
  const arr = _.map(array, (a) => _.set(a, field, a[field].toLowerCase()));
  const startsWith = _.filter(arr, (a) => a[field].search(n) === 0);

  if (startsWith.length === 1) {
    return _.head(startsWith);
  }

  const distances = _.map(arr, (item) => {
    const lev = new Levenshtein(item[field], n);
    return {
      distance: lev.distance,
      item: item
    };
  });
  return _.first(_.sortBy(distances, 'distance')).item;
};

exports.command = (commands, command) => {
  const cmds = _.map(commands, (c) => c.toLowerCase());
  const cmd = command.toLowerCase();
  const startsWith = _.filter(cmds, (c) => c.search(cmd) === 0);

  if (startsWith.length) {
    return startsWith;
  }

  const distances = _(cmds)
    .map((c) => ({
      cmd: c,
      distance: (new Levenshtein(c, cmd).distance)
    }))
    .sortBy('distance')
    .map('cmd')
    .take(3)
    .value();

  return distances;
};
