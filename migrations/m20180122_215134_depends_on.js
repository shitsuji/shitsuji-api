const { createEdge, createIndex } = require('./helpers');

async function createDependsOnEdge(db) {
  createEdge(db, 'DependsOn', 'Version', 'Version');
  createIndex(db, 'DependsOn', ['in', 'out'], 'UNIQUE');
}

exports.name = "depends_on";

exports.up = function (db) {
  return createDependsOnEdge(db);
};

exports.down = function (db) {
  // @todo implementation
};

