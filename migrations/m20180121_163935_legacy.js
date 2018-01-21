async function removeIsLegacyProp(db) {
  const c = await db.class.get('Application');

  return c.property.drop('isLegacy');
}

exports.name = "legacy";

exports.up = function (db) {
  return removeIsLegacyProp(db);
};

exports.down = function (db) {
  // @todo implementation
};

