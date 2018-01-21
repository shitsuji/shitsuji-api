const { createClass, createIndex } = require('./helpers');
const bcrypt = require('bcrypt');

const DEFAULT_USER = {
  login: 'admin',
  password: bcrypt.hashSync('admin', 10)
};

async function createUser(db) {
  await createClass(db, 'User', null, [
    { name: 'createdAt', type: 'DateTime', default: '"sysdate()"' },
    { name: 'login', type: 'String' },
    { name: 'password', type: 'String' }
  ]);

  await createIndex(db, 'User', ['login'], 'UNIQUE');

  const User = await db.class.get('User');
  return User.create(DEFAULT_USER);
}

exports.name = "users";

exports.up = function (db) {
  return createUser(db);
};

exports.down = function (db) {
  // @todo implementation
};

