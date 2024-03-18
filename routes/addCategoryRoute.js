const express = require("express");
const router = express.Router();
const { User } = require("../schema/registerSchema");
const { needCategory } = require("../schema/needSchema");
const { wantCategory } = require("../schema/wantSchema");
const { sessionAuth } = require("../backend/passport-config");
const path = require("path");

router.get("/", sessionAuth, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../fontend/addCategory.html"));
});

router.post("/needs", sessionAuth, async (req, res) => {
  /*we are getting current date with time using new Date method and then  convert 
  the valur we get to 29/02/2024, 19:16:51 this string which can be split(',') at "29/02/2024, 19:16:51" which will split string to two
        array from , and we can use arrayindex to get 29/02/2024 only and send it to mongo for future use*/

  var a = new Date().toLocaleString().split(",");

  const need = new needCategory({
    categoryName: req.body.Nname,
    page: "Needs",
    Dates: a[0],
  });
  await need.save();

  let needs = await User.updateOne(
    { _id: req.user.id },
    { $push: { Ncategory: need._id } }
  );
});

router.get("/getwant", sessionAuth, async (req, res) => {
  //* we are finding user in mongoDB by our id saved in seesion from login
  //*then we use populate to populate the Wcategory array with collections from
  //*Wants category and executing it and getting value in variable popu using async/await
  let popu = await User.findOne({ _id: req.user._id })
    .populate("Wcategory")
    .exec();
  res.send(popu.Wcategory);
});

router.post("/wants", sessionAuth, async (req, res) => {
  console.log(req.body.Wname);
  var a = new Date().toLocaleString().split(",");
  const want = new wantCategory({
    categoryName: req.body.Wname,
    page: "Wants",
    Dates: a[0],
  });
  await want.save();
  await User.updateMany(
    { _id: req.user.id },
    { $push: { Wcategory: want._id } }
  );
});

module.exports = router;
