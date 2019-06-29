const request = require('supertest');
const server = require('./server.js');
const db = require('../data/dbConfig');

const game = {
  title: 'temp game',
  genre: 'puzzle',
  releaseYear: 2005
}

describe('server.js', () => {
  it('should set the test environment', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  describe('GET /', () => {
    afterEach(async () => {
      await db('games').truncate();
    });

    it('should return 200', async () => {
      const res = await request(server)
        .get('/');

      expect(res.status).toBe(200);
    });

    it('should return JSON', async () => {
      const res = await request(server)
        .get('/');

      expect(res.type).toBe('application/json');
    });

    it('should return api: active', async () => {
      const res = await request(server)
        .get('/');

      expect(res.body).toEqual({ api: 'active' });
    });
  });

  describe('GET /games', () => {
    afterEach(async () => {
      await db('games').truncate();
    });
    
    it('should return 200', async () => {
      const res = await request(server)
        .get('/games')

      expect(res.status).toBe(200)
    });

    it('should return an array', async () => {
      const res = await request(server)
        .get('/games')

      expect(res.body).toEqual([])
    })

    it('should return the games in the database', async () => {
      await request(server)
        .post('/games')
        .send(game);

      const res = await request(server)
        .get('/games');

      const compare = await db('games')

      expect(res.body).toEqual(compare)
    });
  });

  describe('GET /games/:id', () => {
    afterEach(async () => {
      await db('games').truncate();
    });

    it('should return 200', async () => {
      await request(server)
        .post('/games')
        .send(game);

      const res = await request(server)
        .get('/games/1');

      expect(res.status).toBe(200);
    })

    it('should return the correct game', async () => {
      await request(server)
        .post('/games')
        .send(game);
      
      await request(server)
        .post('/games')
        .send({
          ...game,
          title: 'test'
        })

      const res = await request(server)
        .get('/games/2');

      expect(res.body.title).toBe('test')
    });

    it('should return an error with status 404 if id isn\'t found', async () => {
      const res = await request(server)
        .get('/games/2000');

      expect(res.status).toBe(404)
    })
  })

  describe('POST /games', () => {
    afterEach(async () => {
      await db('games').truncate();
    });

    it('should return 200 when posting correct data format', async () => {
      const res = await request(server)
        .post('/games')
        .send(game);

      expect(res.status).toBe(200)
    });

    it('should return 422 when posting incorrect data format', async () => {
      let newGame = {
        ...game
      };
      delete newGame.title;

      const res = await request(server)
        .post('/games')
        .send(newGame);
        
      expect(res.status).toBe(422)
    });

    it('should return 405 when posting a duplicate title', async () => {
      await request(server)
        .post('/games')
        .send(game);
      
      const res = await request(server)
        .post('/games')
        .send(game);
      
      expect(res.status).toBe(405);
    })

    it('should return JSON', async () => {
      const res = await request(server)
        .post('/games')
        .send(game);
      
      expect(res.type).toBe('application/json');
    })
  })

  describe('DELETE /games/:id', () => {
    afterEach(async () => {
      await db('games').truncate();
    });

    it('should return 200', async () => {
      await request(server)
        .post('/games')
        .send(game);

      const res = await request(server)
        .delete('/games/1');

      expect(res.status).toBe(200);
    })

    it('should delete the appropriate game', async () => {
      await request(server)
        .post('/games')
        .send(game);

      await request(server)
        .post('/games')
        .send({
          ...game,
          title: 'temp'
        });

      await request(server)
        .delete('/games/1');
      
      const compare = await db('games');
      expect(compare[0].title).toBe('temp')
    })

    it('should 404 if attempting to delete a game not in the database', async () => {
      await request(server)
        .post('/games')
        .send(game);

      const res = await request(server)
        .delete('/games/2');

      const compare = await db('games');
      expect(compare).toHaveLength(1);
      expect(res.status).toBe(404);
    })
  })
})