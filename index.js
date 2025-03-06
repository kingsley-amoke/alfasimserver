const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { creditUser } = require("./monnify");
const { buyData, buyAirtime } = require("./asb");

const app = express();

const PORT = 3002;

var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors());

app.use(jsonParser);
app.use(urlencodedParser);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/transfer", (req, res) => {
  creditUser(req.body).then(() => res.send(200));
});

app.post("/data/buy", async (req, res) => {
  buyData(req.body).then((data) => res.send(data));
});

app.post("/airtime/buy", async (req, res) => {
  buyAirtime(req.body).then((data) => res.send(data));
});

app.listen(PORT, () => {
  console.log(`App listening on port : ${PORT}`);
});
