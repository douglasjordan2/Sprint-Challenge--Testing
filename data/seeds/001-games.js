
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('games').del()
    .then(function () {
      // Inserts seed entries
      return knex('games').insert([
        {
          id: 1, 
          title: 'Game 1',
          genre: 'action',
          releaseYear: 1999
        },
        {
          id: 2, 
          title: 'Game 2',
          genre: 'adventure',
          releaseYear: 2002
        },
        {
          id: 3, 
          title: 'Game 3',
          genre: 'action',
          releaseYear: 1999
        }
      ]);
    });
};
