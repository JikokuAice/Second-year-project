const express = require("express");
const router = express.Router();
const { User, wallet } = require("../schema/registerSchema");
const { needCategory, needItem } = require("../schema/needSchema");
const { sessionAuth } = require("../backend/passport-config");
const path = require("path");
const transactionHistory = require("../schema/transaction");
router.get("/", sessionAuth, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../fontend/need.html"));
});

router.post("/items", async (req, res) => {
  const { Name, Price, categoryName } = req.body;
  const Sdate = new Date().toLocaleString().split(",")[0];
  const item = new needItem({
    itemName: Name,
    itemprice: Price,
    category: categoryName,
    Dates: Sdate,
  });
  let fetch = await item.save();
  let ak = await needCategory.findOneAndUpdate(
    { categoryName: categoryName },
    { $push: { items: item._id } }
  );

  let transaction = new transactionHistory({
    Tname: Name,
    Tcategory: "Need",
    Tprice: Price,
    TDates: Sdate,
  });

  await transaction.save();

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { transactionHistory: transaction._id } }
  );

  res.send(fetch);
});

router.get("/item", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
   
    const populatedCategories = await Promise.all(
      user.Ncategory.map(async (categoryId) => {
        const category = await needCategory
          .findById(categoryId)
          .populate("items");
        return category;
      })
    );

    const filteredCategories = populatedCategories.filter(
      (category) => category !== null
    );
    res.send(filteredCategories);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/calculation", async (req, res) => {
  const { calculate, key, expense } = req.body;
  await wallet.findByIdAndUpdate(
    { _id: key },
    { Needs: calculate, expense: expense }
  );
  res.send("ok");
});
module.exports = router;
