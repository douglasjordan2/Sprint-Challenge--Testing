const express = require('express');

const Games = require('../games/games-model');

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json({ api: 'active' });
});

server.get('/games', async (req, res) => {
  try {
    const games = await Games.getAll()
    res.status(200).json(games)
  } catch (err) {
    res.status(500).json({ message: 'error' })
  }
})

server.get('/games/:id', validateId, async (req, res) => {
  const { id } = req.params;
  
  try {
    const game = await Games.getById(parseInt(id));
    res.status(200).json(game)
  } catch (err) {
    res.status(500).json({ message: 'error' })
  }
})

server.post('/games', validateData, validateTitle, async (req, res) => {
  try {
    const game = await Games.insert(req.body)
    res.status(200).json(game)
  } catch (err) {
    res.status(500).json({ message: 'not found' })
  }
})

server.delete('/games/:id', validateId, async (req, res) => {
  try {
    const del = await Games.remove(parseInt(req.params.id));
    res.status(200).json(del)
  } catch (err) {
    res.status(500).json({ message: 'error' })
  }
})

// middleware
async function validateId(req, res, next) {
  const { id } = req.params;
  const ids = await Games.getAll().map(game => game.id);

  if(ids.includes(parseInt(id))) {
    next();
  } else {
    res.status(404).json({ message: `game with id ${id}not found` })
  }
}

function validateData(req, res, next) {
  const { title, genre } = req.body;
  
  if(title && genre) {
    next();
  } else {
    res.status(422).json({ message: 'invalid format' })
  }
}

async function validateTitle(req, res, next) {
  const { title } = req.body;
  const titles = await Games.getAll().map(game => game.title);

  if(!titles.includes(title)) {
    next();
  } else {
    res.status(405).json({ message: 'duplicate title' })
  }
}

module.exports = server;