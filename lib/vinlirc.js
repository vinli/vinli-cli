'use strict';

const _ = require('lodash');
const B = require('bluebird');
const Path = require('path');
const fs = B.promisifyAll(require('fs'));

const getConfigIfExistsSync = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file));
  } catch (err) {
    return {};
  }
};

const fileExists = (file) => {
  return fs.statAsync(file)
    .then((stat) => stat.isFile())
    .catch(() => false);
};

const home = (process.env.HOME || process.env.USERPROFILE) + Path.sep;

/*  Return list of possible paths to .vinlirc files always starting with home directory
 and ending with current working directory.
[ /home/.vinlirc, /home/path/.vinlirc, /home/path/to/.vinlirc, /home/path/to/cwd/.vinlirc ]
 If home directory outside of CWD tree:
 [ /home/.vinlirc, /.vinlirc, /path/.vinlirc, /path/to/.vinlirc, /path/to/cwd/.vinlirc ]
*/
const getConfigs = (cwd) => {
  const parts = (cwd || process.cwd()).split(Path.sep);
  const paths = _.reduce(parts, (ps, p) => ps.concat((_.last(ps) || '') + p + Path.sep), []);
  const pathsWithHome = _.some(paths, (p) => p === home)
    ? _.filter(paths, (p) => p.search(home) === 0)
    : _.concat([ home ], paths);

  const files = _.map(pathsWithHome, (p) => `${p}.vinlirc`);
  return files;
};
const fields = [
  'app', 'secret', 'device', 'dummy', 'caseId', 'deviceName', 'appName', 'route', 'routeName'
];
const getEnv = () => {
  const env = {};
  const envs = _.map(fields, (f) => [ f, `VINLI_${_.snakeCase(f).toUpperCase()}` ]);

  _.forEach(envs, (e) => _.set(env, e[0], process.env[e[1]]));

  if (_.filter(env).length) {
    return _.merge({}, env, { env: env });
  }
  return {};
};

const getParams = (program) => {
  const par = _.pick(program, fields);
  if (_.filter(par).length) {
    return _.merge({}, par, { path: par });
  }
  return {};
};

// Synchronously  Get composite `.vinlirc` file
const getFile = (program, cwd) => {
  const files = getConfigs(cwd);
  const configs = _.map(files, getConfigIfExistsSync);
  const config = _.reduce(configs, (conf, c) => _.merge(conf, c));
  if (_.filter(config).length) {
    return _.merge({}, config, { file: config });
  }
  return {};
};

const readConfig = (program, cwd) => {
  return _.merge({}, getFile(cwd), getEnv(), getParams(program));
};

const saveConfig = (config, global, cwd) => {
  if (typeof config !== 'object') {
    throw new Error(`Config not a json object: ${config}`);
  }

  const files = getConfigs(cwd);
  const configs = global ? [ _.head(files) ] : files;
  return B.resolve(configs)
    .filter(fileExists)
    .then((cfgs) => _.last(cfgs) || (global ? _.head(configs) : _.last(configs)))
    .then((configToUpdate) => {
      return fs.readFileAsync(configToUpdate)
        .then(JSON.parse)
        .catch(() => ({}))
        .then((toUpdateContents) => {
          _.merge(toUpdateContents, config);
          return fs.writeFileAsync(configToUpdate, JSON.stringify(toUpdateContents, null, 2));
        })
        .then(() => configToUpdate);
    });
};

module.exports = {
  save: saveConfig,
  read: readConfig
};
