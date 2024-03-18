const express = require("express");
const router = express.Router();
const { User, wallet } = require("../schema/registerSchema");
const { needCategory, needItem } = require("../schema/needSchema");
const { sessionAuth } = require("../backend/passport-config");
const path = require("path");

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
  res.send(fetch);
});

router.get("/item", async (req, res) => {
  let populated = await User.findOne(req.user._id);

  let arr = populated.Ncategory;
  const arrays = [];
  for (let e of arr) {
    let objId = e.toString();
    let data = await needCategory
      .findOne({ _id: objId })
      .populate("items")
      .exec();

    if (data != null) {
      arrays.push(data);
    }
  }
  res.send(arrays);
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
