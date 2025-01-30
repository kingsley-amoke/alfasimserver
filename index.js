const express = require('express');

const app = express();

const PORT = 3000;

app.get('/', (req, res) => {

res.send('Hello World')
});

app.get('/transfer', (req, res) => {
    res.send('Transfer')
    console.log('Transfer')
    });

app.listen(PORT);