const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ASBRouter = require("./routes/asb");
const DatabaseRouter = require("./routes/database");
const MonnifyRouter = require("./routes/monnify");

const app = express();

const PORT = 3002;

var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors());

app.use(jsonParser);
app.use(urlencodedParser);

app.use(ASBRouter);

app.use(DatabaseRouter);

app.use(MonnifyRouter);
app.listen(PORT, () => {
  console.log(`App listening on port : ${PORT}`);
});
