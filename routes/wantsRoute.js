const express = require("express");
const router = express.Router();
const { User, wallet } = require("../schema/registerSchema");
const { wantCategory, wantItem } = require("../schema/wantSchema");
const { sessionAuth } = require("../backend/passport-config");
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

  await wantCategory.findOneAndUpdate(
    { categoryName: categoryName },
    { $push: { items: item._id } }
  );
  //sending item we added to db  to frontend after storing in db
  res.send(fetch);
});

router.get("/item", async (req, res) => {
  let populated = await User.findOne(req.user._id);

  //we getting every WCategory id that si pushed in User DB.
  let arr = populated.Wcategory;

  //initializing empty array
  const arrays = [];

  //using for each loop to get each object individually.
  for (let e of arr) {
    //converting ObjID('ID') to 'ID'
    let objId = e.toString();
    //finding each want category and pupulating items DB in it .
    let data = await wantCategory
      .findOne({ _id: objId })
      .populate("items")
      .exec();

    if (data != null) {
      //pushing each populated wants category to array
      arrays.push(data);
    }
  }
  //sending arrays in front end.
  res.send(arrays);
});

router.post("/calculation", async (req, res) => {
  const { calculate, key } = req.body;
  await wallet.findByIdAndUpdate({ _id: key }, { Wants: calculate });
  res.send("ok");
});

module.exports = router;
