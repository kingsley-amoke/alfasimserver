const express = require("express");
const Database = require("../controllers/supabase");

const DatabaseRouter = express.Router();

DatabaseRouter.post("/redeem", (req, res) => {
  Database.redeemBonus(req.body).then((data) => res.send(data));
});

module.exports = DatabaseRouter;
