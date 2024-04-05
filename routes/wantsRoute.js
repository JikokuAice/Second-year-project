const express = require("express");
const router = express.Router();
const { User, wallet } = require("../schema/registerSchema");
const { wantCategory, wantItem } = require("../schema/wantSchema");
const { sessionAuth } = require("../backend/passport-config");
const transactionHistory = require("../schema/transaction");
const path = require("path");

router.get("/", sessionAuth, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../fontend/want.html"));
});

router.post("/items", async (req, res) => {
  const { Name, Price, categoryName } = req.body;

  const Sdate = new Date().toLocaleString().split(",")[0];

  const item = new wantItem({
    itemName: Name,
    itemprice: Price,
    category: categoryName,
    Dates: Sdate,
  });

  let fetch = await item.save();

  let transaction = new transactionHistory({
    Tname: Name,
    Tcategory: "Want",
    Tprice: Price,
    TDates: Sdate,
  });

  await transaction.save();

  await wantCategory.findOneAndUpdate(
    { categoryName: categoryName },
    { $push: { items: item._id } }
  );

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { transactionHistory: transaction._id } }
  );

  //sending item we added to db  to frontend after storing in db
  res.send(fetch);
});

router.get("/item", async (req, res) => {
  let user = await User.findOne(req.user._id);

  const wantList = await Promise.all(
    //we map wantCategory and if we mistakly map needCategory then we can find wantcategory using id that is stored inside of userWcategory array.
    user.Wcategory.map(async (id) => {
      const category = await wantCategory.findById(id).populate("items").exec();
      return category;
    })
  );
  let filteredCategories = wantList.filter((e) => e !== null);
  //we getting every WCategory id that si pushed in User DB.
  //sending arrays in front end.
  res.send(filteredCategories);
});

router.post("/calculation", async (req, res) => {
  const { calculate, key, expense } = req.body;
  await wallet.findByIdAndUpdate(
    { _id: key },
    { Wants: calculate, expense: expense }
  );
  res.send("ok");
});

module.exports = router;
