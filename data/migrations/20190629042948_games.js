
exports.up = function(knex, Promise) {
  return knex.schema.createTable('games', tbl => {
    tbl.increments();
    tbl
      .string('title')
      .unique('uq_title')
      .notNullable();
    tbl
      .string('genre')
      .notNullable();
    tbl
      .integer('releaseYear');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('games');
};
