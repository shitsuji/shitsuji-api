async function updateRepository(db) {
  return db.class.update({
    name: 'Repository',
    superClass: 'V'
  });
}

exports.name = "repository_as_vertex";

exports.up = function (db) {
  return updateRepository(db);
};

exports.down = function (db) {
  // @todo implementation
};

