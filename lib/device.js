'use strict';

exports.assertDevice = (options) => {
  if (!options.device) {
    throw new Error(`Device not set.  Set a device id with a --device parameter,
 save a device id as VINLI_DEVICE environment variable,
 or save to vinlirc with 'vinli device set-current'`);
  }
  return options;
};
