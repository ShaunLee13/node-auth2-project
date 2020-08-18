const express = require("express");
const helmet = require("helmet");
const cors = require("cors");


const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.status(200).json({ api: "is active" });
});

server.post('/api/register', (req, res) => {

})
server.post('/api/login', (req, res) => {
    
})
server.get('/api/users', (req, res) => {
    
})



module.exports = server;