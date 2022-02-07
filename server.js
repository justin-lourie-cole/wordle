const express = require('express')
const axios = require('axios')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())

app.get('/word', (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
    params: { count: '5', wordLength: '5' },
    headers: {
      'x-rapidapi-host': 'random-words5.p.rapidapi.com',
      'x-rapidapi-key': process.env.RAPID_API_KEY
    }
  };

  axios.request(options).then((response) => {
    console.log(response.data);
    return res.json(response.data[0]);
  }).catch((error) => {
    console.error(error);
  });
})

app.get('/check', (req, res) => {
  const { word } = req.query

  let options = {
    method: 'GET',
    url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/association/',
    params: { entry: word },
    headers: {
      'x-rapidapi-host': 'twinword-word-graph-dictionary.p.rapidapi.com',
      'x-rapidapi-key': process.env.RAPID_API_KEY
    }
  };

  axios.request(options).then((response) => {
    console.log(response.data);
    res.json(response.data.result_code)
  }).catch((error) => {
    console.error(error);
  });
})



module.exports = app