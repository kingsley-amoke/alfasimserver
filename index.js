const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {creditUser} = require('./monnify');

const app = express();

const PORT = 3000;

var jsonParser = bodyParser.json()
 
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cors());

app.use(jsonParser);
app.use(urlencodedParser);

app.get('/', (req, res) => {

res.send('Hello World')
});


app.post('/transfer', (req, res) => {
    res.send(200);
    creditUser(req.body);

    });

app.listen(PORT, ()=>{
    console.log(`App listening on port : ${PORT}`);
}
);