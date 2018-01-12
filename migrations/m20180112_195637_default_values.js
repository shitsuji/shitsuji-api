"use strict";
exports.name = "default-values";

async function setCreatedAtDefaultValue(db, className) {
  const c = await db.class.get(className);
  return c.property.update({
    name: 'createdAt',
    default: '"sysdate()"'
  }).catch((err) => {
    console.log(err);
    throw err;
  });
}

async function makePropsMandatory(db, className, props) {
  const c = await db.class.get(className);
  return Promise.all(props.map((propName) => c.property.update({
    name: propName,
    mandatory: true,
    notNull: true,
    min: 1
  }).catch((err) => {
    console.log(err);
    throw err;
  })));
}

const classes = ['Repository', 'Commit', 'Project', 'Application', 'Version'];

exports.up = function (db) {
  const result = Promise.all(
    [
      ...classes.map((name) => setCreatedAtDefaultValue(db, name)),
      makePropsMandatory(db, 'Repository', ['url', 'name', 'privateKey', 'publicKey']),
      makePropsMandatory(db, 'Commit', ['author', 'message', 'hash']),
      makePropsMandatory(db, 'Project', ['name']),
      makePropsMandatory(db, 'Application', ['name', 'key']),
      makePropsMandatory(db, 'Version', ['number'])
    ]
  );
  return result;
};

exports.down = function (db) {
  // @todo implementation
};

