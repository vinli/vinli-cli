'use strict';

exports.assertStack = (options) => {
  if (!options.stack || !process.env.VINLI_STACK) {
    throw new Error(`Stack not set.  Save the stack to vinlirc
     with the 'vinli stack set' command,
    or as an environment variable, VINLI_STACK`);
  }
  return options;
};
