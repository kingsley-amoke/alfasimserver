const express = require("express");
const MonnifyController = require("../controllers/monnify");

const MonnifyRouter = express.Router();

MonnifyRouter.post("/transfer", (req, res) => {
  MonnifyController.creditUser(req.body).then(() => res.send(200));
});

MonnifyRouter.post("/account/create", (req, res) => {
  MonnifyController.getCustomerAccount(req.body).then((data) => res.send(data));
});

module.exports = MonnifyRouter;
