const { createEdge, createIndex } = require('./helpers');

async function updateRepositoryEdge(db) {
  const c = await db.class.get('Application');
  
  await c.property.drop('repository');
  await createEdge(db, 'IsIn', 'Application', 'Repository')
  
  return createIndex(db, 'IsIn', ['in', 'out'], 'UNIQUE');
}

exports.name = "repository_edge";

exports.up = function (db) {
  return updateRepositoryEdge(db);
};

exports.down = function (db) {
  // @todo implementation
};

