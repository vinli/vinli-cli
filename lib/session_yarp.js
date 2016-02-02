'use strict';

const _ = require('lodash');
const service = require('../lib/service');
const yarp = require('yarp');

const devService = service('dev');
const authService = service('auth');

const cookieRegex = /(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/;

const extractCookie = (headers) => headers['set-cookie'][0].match(cookieRegex)[0];

const sessionYarp = (authority, email, password, request) =>
  yarp({
    method: 'POST',
    url: `${authority}/api/v1/sessions`,
    json: {
      session: {
        email: email,
        password: password
      }
    }
  }, true)
  .then((resp) => {
    if (resp.statusCode === 400 || resp.statusCode === 401) {
      throw new Error('Invalid login credentials');
    }
    if (resp.statusCode === 403) {
      throw new Error('You must first verify your account (click the link in the email)');
    }
    const cookie = extractCookie(resp.headers);

    console.log('Authenticated user');
    _.set(request, 'headers.cookie', cookie);
    return yarp(request);
  });

exports.dev = (email, password, request) => sessionYarp(devService, email, password, request);

exports.auth = (email, password, request) => sessionYarp(authService, email, password, request);
