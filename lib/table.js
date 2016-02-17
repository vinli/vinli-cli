'use strict';

const Table = require('table');
const _ = require('lodash');
const colors = require('colors/safe');

const defaultFormat = function(value) {
  if (_.isDate(value)) {
    return value.toISOString();
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return value;
};

const buildHeadingOptions = function(headings) {
  return _.map(headings, (heading) => {
    if (typeof heading === 'string') {
      return {
        title: heading,
        key: heading,
        alignment: 'left',
        format: defaultFormat
      };
    }

    if (!heading.key) {
      throw new Error('Heading must have a `key` property');
    }

    return _.merge({
      alignment: 'left',
      title: heading.key,
      format: defaultFormat
    }, heading);
  });
};

const countLine = function(items, pagination) {
  if (pagination) {
    if (_.has(pagination, 'remaining')) {
      if (pagination.remaining === 0 && items.length === 0) {
        return 'No items to display';
      }

      return `Showing ${items.length}, ${pagination.remaining || 'None'} remaining`;
    } else if (_.has(pagination, 'total')) {
      if (pagination.total === 0) {
        return 'No items to display';
      }

      return `Showing ${pagination.offset + 1} - ${pagination.offset + Math.min(pagination.limit, items.length)}`
             + ` of ${pagination.total}`;
    }
  }
  return 'Showing all items';
};

module.exports.renderTable = function(items, headings, pagination, noFormat) {
  if (noFormat && items.length === 0) {
    return '';
  }

  const headingOptions = buildHeadingOptions(headings);

  const hasMultiline = _.some(headingOptions, 'wrapWord');

  const config = {
    border: Table.getBorderCharacters(noFormat ? 'void' : 'norc'),
    columns: {},
    drawHorizontalLine: (index, size) => {
      if (noFormat) {
        return false;
      }

      if (hasMultiline) {
        return true;
      }

      return index === 0 || index === 1 || index === size;
    }
  };

  const columns = _.map(headingOptions, (opt) => _.pick(opt, [ 'alignment', 'width', 'wrapWord' ]));

  _.each(columns, (column, index) => config.columns[index] = column);

  const data = noFormat ? [] : [ _.map(headingOptions, (heading) => colors.cyan.bold(`${heading.title}`)) ];

  _.each(items, (item) => {
    data.push(_.map(headingOptions, (heading) => heading.format(_.get(item, heading.key))));
  });

  const t = Table.default(data, config);

  if (noFormat) {
    return t;
  }

  const len = _.min(_.filter(_.map(t.trim().split('\n'), (line) => line.trim().length)));
  return `${t}${_.padStart(countLine(items, pagination), len)}`;
};

module.exports.renderItem = function(item, headings) {
  const headingOptions = buildHeadingOptions(headings);

  const config = {
    border: Table.getBorderCharacters(`norc`),
    columns: {
      0: {
        alignment: 'right'
      },
      1: {
        alignment: 'left'
      }
    },
    drawHorizontalLine: (index, size) => {
      return index === 0 || index === size;
    }
  };

  const data = _.map(headingOptions, (heading) => {
    return [ colors.cyan.bold(`${heading.title}`), heading.format(_.get(item, heading.key)) ];
  });

  return Table.default(data, config);
};
