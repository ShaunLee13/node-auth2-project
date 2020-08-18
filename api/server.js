const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const constants = require('../config/constants')

const Users = require('./user-model')
const restricted = require('../restricted/middleware')

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.status(200).json({ api: "is active" });
});

server.post('/api/register', (req, res) => {
    const user = req.body;

    if (user.username && user.password && user.department) {
      user.password = bcryptjs.hashSync(user.password, constants.rounds);
      Users.add(user)
        .then(user => {
          res.status(201).json({ data: user });
        })
        .catch(error => {
          res.status(500).json({ message: error.message });
        });
    } else {
      res.status(400).json({
        message: "Please provide all necessary information for registration.",
      });
    }
})
server.post('/api/login', (req, res) => {
    const { username, password } = req.body;

  if (username && password) {
    Users.findBy({ username: username })
      .then(([user]) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = signToken(user)

          res.status(200).json({ message: "Access granted", token });
        } else {
          res.status(401).json({ message: "You shall not pass!" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "Please provide username and password",
    });
  }
})
server.get('/api/users', restricted, (req, res) => {
    Users.find()
    .then(users => {
      res.status(200).json({users});
    })
    .catch(error => 
        res.status(500).json({message: error.message}));
})


function signToken(user) {
    const payload = {
      subject: user.id,
      username: user.username,
      role:user.role
    }
  
    const secret = constants.jwt
  
    const options = {
      expiresIn: '1d'
    }
  
    return jwt.sign(payload, secret, options)
  }

module.exports = server;