'use strict';

const origins = {
  prod: {
    platform: 'https://platform.vin.li',
    telemetry: 'https://telemetry.vin.li',
    event: 'https://events.vin.li',
    trip: 'https://trips.vin.li',
    dev: 'https://dev.vin.li',
    auth: 'https://auth.vin.li',
    rule: 'https://rules.vin.li',
    dummy: 'https://dummies.vin.li',
    stream: 'wss://stream.vin.li'
  }
};

module.exports = function(service, stack) {
  return origins[stack || 'prod'][service];
};
