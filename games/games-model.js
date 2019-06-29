const db = require('../data/dbConfig');

module.exports = {
  insert,
  getAll,
  getById,
  remove
}

async function insert(game) {
  const [id] = await db('games').insert(game);
  return getById(id)
}

function getAll() {
  return db('games');
}

function getById(id) {
  return db('games').where({ id }).first();
}

async function remove(id) {
  return await getById(id)
    .del();
}