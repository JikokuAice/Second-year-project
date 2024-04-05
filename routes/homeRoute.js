const express = require("express");
const router = express.Router();
const { User, wallet } = require("../schema/registerSchema");
const { sessionAuth } = require("../backend/passport-config");
const path = require("path");

router.get("/", sessionAuth, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../fontend/home.html"));
});

router.post("/allocation", async (req, res) => {
  if (!req.user) {
    res.redirect("/");
  }

  const income = req.body.incAllocation;
  const Wants = income * (30 / 100);
  const needs = income * (50 / 100);
  const saving = income * (20 / 100);
  const expense = 0;
  const email = req.user.username;

  const budget = new wallet({
    income: income,

    Wants: Wants,

    expense: expense,

    Needs: needs,

    Saving: saving.toFixed(1),

    Email: email,

    currentDate: new Date(),
  });

  budget.save();

  let ak = await User.updateOne(
    { _id: req.user._id },
    { $set: { wallets: budget._id } }
  );

  res.redirect("/home");
});

router.get("/allocation", async (req, res) => {
  if (!req.user) {
    res.redirect("/");
  }
  try {
    //finding user by user id then
    let jk = await User.findOne({ _id: req.user._id })
      .populate("wallets")
      .exec();
    res.send(jk.wallets);
  } catch (err) {
    res.sendFile(path.resolve(__dirname, "../redirect/serverErr.html"));
  }
});

module.exports = router;
