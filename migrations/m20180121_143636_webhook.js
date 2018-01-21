const { createIndex } = require('./helpers');

async function addKeyToRepository(db) {
  const c = await db.class.get('Repository');
  
  await c.property.create([{
    name: 'key',
    type: 'String',
    default: '"uuid()"'
  }]);

  return createIndex(db, 'Repository', ['key'], 'UNIQUE');
}

exports.name = "webhook";

exports.up = function (db) {
  return addKeyToRepository(db);
};

exports.down = function (db) {
  // @todo implementation
};

