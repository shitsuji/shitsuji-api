const { createClass, createEdge, createIndex } = require('./helpers');

async function createSchema(db) {
  let promises = [];

  promises.push(createClass(db, 'Repository', null, [
    { name: 'url', type: 'String' },
    { name: 'createdAt', type: 'Date' }    
  ]));

  promises.push(createClass(db, 'Commit', null, [
    { name: 'author', type: 'String' },
    { name: 'createdAt', type: 'Date' },
    { name: 'message', type: 'String' },
    { name: 'hash', type: 'String' }
  ]));

  promises.push(createClass(db, 'Project', 'V', [
    { name: 'name', type: 'String' },
    { name: 'createdAt', type: 'Date' }
  ]));

  await Promise.all(promises);  
  promises = [];
  
  promises.push(createClass(db, 'Application', 'V', [
    { name: 'name', type: 'String' },
    { name: 'key', type: 'String' },
    { name: 'createdAt', type: 'Date' },
    { name: 'isGenerated', type: 'Boolean' },
    { name: 'isLegacy', type: 'Boolean' },
    { name: 'repository', type: 'Embedded', linkedClass: 'Repository'}
  ]));

  promises.push(createClass(db, 'Version', 'V', [
    { name: 'number', type: 'String' },
    { name: 'createdAt', type: 'Date' },
    { name: 'commit', type: 'Embedded', linkedClass: 'Commit'}
  ]));

  await Promise.all(promises);  
  promises = [];

  promises.push(createEdge(db, 'Has', 'Application', 'Version'));
  promises.push(createEdge(db, 'PartOf', 'Application', 'Project'));
  
  await Promise.all(promises);
  promises = [];
  
  promises.push(createIndex(db, 'Project', ['name'], 'UNIQUE'));
  promises.push(createIndex(db, 'Application', ['name', 'key'], 'UNIQUE'));
  promises.push(createIndex(db, 'Has', ['in', 'out'], 'UNIQUE'));
  promises.push(createIndex(db, 'PartOf', ['in', 'out'], 'UNIQUE'));

  await Promise.all(promises);
}

exports.name = 'init';

exports.up = function (db) {
  return createSchema(db);
};

exports.down = function (db) {
  // @todo implementation
};

