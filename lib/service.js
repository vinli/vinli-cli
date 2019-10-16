'use strict';
const vinlirc = require('./vinlirc.js')

const origins = (stack) => ({
  platform: `https://platform${stack}`,
  telemetry: `https://telemetry${stack}`,
  event: `https://events${stack}`,
  trip: `https://trips${stack}`,
  dev: `https://dev${stack}`,
  auth: `https://auth${stack}`,
  rule: `https://rules${stack}`,
  dummy: `https://dummies${stack}`,
  stream: `wss://stream${stack}`
});

module.exports = function(service, stack) {
  const config = vinlirc.read()
  // console.log(file)
  return origins(process.env.VINLI_STACK || stack || config.stack || '.vin.li')[service];
};
