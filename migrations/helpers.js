const { Class, Db, PropertyCreateConfig, Server } =  require('orientjs');

const DataTypes = {
  Boolean: 0,
  Integer: 1,
  Short: 2,
  Long: 3,
  Float: 4,
  Double: 5,
  Datetime: 6,
  String: 7,
  Binary: 8,
  Embedded: 9,
  EmbeddedList: 10,
  EmbeddedSet: 11,
  EmbeddedMap: 12,
  Link: 13,
  LinkList: 14,
  LinkSet: 15,
  LinkMap: 16,
  Byte: 17,
  Transient: 18,
  Date: 19,
  Custom: 20,
  Decimal: 21,
  LinkBag: 22
}

exports.DataTypes = DataTypes;

exports.createClass = async function (db, name, superClass, config) {
  let c;

  try {
    c = await db.class.get(name);
  } catch (e) {
    c = await db.class.create(name, superClass);
  }

  return Promise.all(config.map(async (conf) => {
    let prop = await c.property.get(conf.name);

    if (!prop) {
      prop = await c.property.create(conf);
    }

    const match = Object.keys(conf)
      .filter((key) => key !== 'type')
      .reduce((acc, key) => acc && (
        conf[key] === prop[key] || DataTypes[conf[key]] === prop[key]
      ), true);

    const typeChanged = DataTypes[conf.type] !== prop.type;

    if (!match || typeChanged) {
      console.log(`Property ${conf.name} of class ${c.name} changed, updating`);

      prop = await c.property.update(conf);
    }

    return prop;
  }));
}

exports.createEdge = async function (db, name, from, to) {
  return exports.createClass(db, name, 'E', [
    { name: 'in', type: 'Link', linkedClass: (typeof to !== 'string') ? to.name : to },
    { name: 'out', type: 'Link', linkedClass: (typeof from !== 'string') ? from.name : from }
  ]);
}

exports.createIndex = async function (db, className, properites, type) {
  const indexName = `${className}Index`;

  return db.index.create({
    name: indexName,
    class: className,
    properites,
    type
  });
}