'use strict';

const yaml = require('js-yaml');
const Table = require('./table');
const _ = require('lodash');

const cleanLinksFromList = function(resp, field) {
  const tr = {};

  tr[field] = _.map(_.get(resp, field), (item) => _.omit(item, 'links'));

  tr.meta = {
    pagination: _.omit(_.get(resp, 'meta.pagination'), 'links')
  };

  return tr;
};

module.exports = {
  printList(type, resp, field, headings) {
    switch (type) {
      case 'json':
        console.log(JSON.stringify(cleanLinksFromList(resp, field), null, 2));
        break;
      case 'yaml':
        console.log(yaml.safeDump(cleanLinksFromList(resp, field)));
        break;
      case 'text':
        console.log(Table.renderTable(_.get(resp, field), headings, _.get(resp, 'meta.pagination'), true));
        break;
      default:
        console.log(Table.renderTable(_.get(resp, field), headings, _.get(resp, 'meta.pagination')));
    }
  },

  printItem(type, item, headings) {
    switch (type) {
      case 'json':
        console.log(JSON.stringify(_.omit(item, 'links'), null, 2));
        break;
      case 'yaml':
        console.log(yaml.safeDump(_.omit(item, 'links')));
        break;
      case 'table':
        console.log(Table.renderTable([ item ], headings));
        break;
      default:
        console.log(Table.renderItem(item, headings));
    }
  }
};
