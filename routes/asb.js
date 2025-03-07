const express = require("express");
const ASBController = require("../controllers/asb");
const ASBRouter = express.Router();

ASBRouter.get("/", (req, res) => {
  res.send("Hello World");
});

ASBRouter.post("/data/buy", async (req, res) => {
  ASBController.buyData(req.body).then((data) => {
    console.log(data);
    res.send(data);
  });
});

ASBRouter.post("/airtime/buy", async (req, res) => {
  ASBController.buyAirtime(req.body).then((data) => res.send(data));
});

module.exports = ASBRouter;
