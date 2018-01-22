async function addBranchToRepository(db) {
  const c = await db.class.get('Repository');
  
  return c.property.create([{
    name: 'branch',
    type: 'String'
  }]);
}

exports.name = "repository_branch";

exports.up = function (db) {
  return addBranchToRepository(db);
};

exports.down = function (db) {
  // @todo implementation
};

