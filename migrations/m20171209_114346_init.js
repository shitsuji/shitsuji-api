const { createClass, createEdge } = require('./helpers');

async function createSchema(db) {
  const promises = [];

  promises.push(createClass(db, 'Repository', null, [
    { name: 'url', type: 'String' }
  ]));

  promises.push(createClass(db, 'Commit', null, [
    { name: 'author', type: 'String' },
    { name: 'createdAt', type: 'Date' },
    { name: 'message', type: 'String' }
  ]));

  promises.push(createClass(db, 'Project', 'V', [
    { name: 'name', type: 'String' },
    { name: 'createdAt', type: 'Date' }
  ]));

  promises.push(createClass(db, 'Application', 'V', [
    { name: 'name', type: 'String' },
    { name: 'createdAt', type: 'Date' },
    { name: 'repository', type: 'Embedded', linkedClass: 'Repository'}
  ]));

  promises.push(createClass(db, 'Version', 'V', [
    { name: 'name', type: 'String' },
    { name: 'createdAt', type: 'Date' },
    { name: 'commit', type: 'Embedded', linkedClass: 'Commit'}
  ]));

  const classes = await Promise.all(promises);

  const partOf = await createEdge(db, 'PartOf', 'Application', 'Project');
  const has = await createEdge(db, 'Has', 'Application', 'Version');
}

exports.name = 'init';

exports.up = function (db) {
  return createSchema(db);
};

exports.down = function (db) {
  // @todo implementation
};

