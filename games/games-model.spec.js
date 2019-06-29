const db = require('../data/dbConfig');
const Games = require('./games-model');

const game_1 = {
  title: 'Game 1',
  genre: 'action',
  releaseYear: 1999
};

const game_2 = {
  title: 'Game 2',
  genre: 'adventure',
  releaseYear: 2002
};

describe('The Games Model', () => {
  describe('insert()', () => {
    afterEach(async () => {
      await db('games').truncate();
    });

    it('should insert a game into the database', async () => {
      await Games.insert(game_1);
      await Games.insert(game_2);

      const games = await db('games');

      expect(games).toHaveLength(2);
      expect(games[0].title).toBe('Game 1')
    });
  });

  describe('getAll()', () => {
    afterEach(async () => {
      await db('games').truncate();
    });

    it('should return an array', async () => {
      const games = await Games.getAll();
      expect(games).toEqual([])
    })

    it('should return an array of games in the database', async () => {
      const games = await Games.getAll();
      const compare = await db('games');
      expect(games).toEqual(compare)
    });

    it('should return the correct data', async () => {
      await Games.insert({
        title: 'temp',
        genre: 'board'
      })

      const games = await Games.getAll();
      expect(games[0].title).toBe('temp')
    })
  })

  describe('getById(id)', () => {
    afterEach(async () => {
      await db('games').truncate();
    });

    it('should return the correct game', async () => {
      await Games.insert({
        title: 'temp',
        genre: 'board'
      })

      const game = await Games.getById(1);
      expect(game.title).toBe('temp')
      expect(game.genre).toBe('board')
      expect(game.id).toBe(1)
    })
  })

  describe('remover(id)', () => {
    afterEach(async () => {
      await db('games').truncate();
    });

    it('should delete a game from the database', async () => {
      await Games.insert(game_1);
      await Games.insert(game_2);
      await Games.remove(1);

      const compare = await db('games');
      expect(compare).toHaveLength(1);
    })
  })
})