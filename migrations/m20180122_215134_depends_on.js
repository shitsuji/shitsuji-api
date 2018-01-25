const { createEdge, createIndex } = require('./helpers');

async function createDependsOnEdge(db) {
  await createEdge(db, 'DependsOn', 'Version', 'Version');
  await createIndex(db, 'DependsOn', ['in', 'out'], 'UNIQUE');
}

exports.name = "depends_on";

exports.up = function (db) {
  return createDependsOnEdge(db);
};

exports.down = function (db) {
  // @todo implementation
};

