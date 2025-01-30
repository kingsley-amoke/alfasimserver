const express = require('express');
const cors = require('cors');

const app = express();

const PORT = 3000;

app.use(cors());

app.get('/', (req, res) => {

res.send('Hello World')
});

app.get('/transfer', (req, res) => {
    res.sendStatus(200);
    console.log('Transfer')
    });

app.listen(PORT, ()=>{
    console.log(`App listening on port : ${PORT}`);
}
);