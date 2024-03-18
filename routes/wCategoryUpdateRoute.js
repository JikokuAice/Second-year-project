const express = require("express");
const router = express.Router();
const { User, wallet } = require("../schema/registerSchema");
const { wantCategory, wantItem } = require("../schema/wantSchema");
const { sessionAuth } = require("../backend/passport-config");
const path = require("path");

router.get("/updateCategoryW", sessionAuth, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../fontend/updatecategoryW.html"));
});

router.post("/updateCategoryW", sessionAuth, (req, res) => {
  const { key } = req.body;
  wantUpdate = key;
  res.send("hello");
});

router.get("/updateCategoryW/value", sessionAuth, (req, res) => {
  res.send(wantUpdate);
});

router.put("/updateCategoryWant", sessionAuth, async (req, res) => {
  const { oldKey, newKey } = req.body;
  if (!(newKey == null || newKey == "")) {
    //i did some mistake using needCategory before where i should have used wantCategory
    await wantCategory.findOneAndUpdate(
      { categoryName: oldKey },
      { categoryName: newKey }
    );
    res.status(200).send({ data: "sucess" });
    return;
  }
  res.status(401).send("ERROR");
});

router.delete("/deleteCategoryWant/:key", sessionAuth, async (req, res) => {
  //getting key as categoryname from fontend
  const { key } = req.params;
  //finding category matching name and removing all list inside it .
  wantCategory.find({ categoryName: key }).then(async (e) => {
    for (let i of e) {
      for (let item of i.items) {
        await wantItem.findOneAndDelete({ _id: item.toString() });
      }
    }
    //deleteing category finally deleting items:[] inside wantCategory.
    await wantCategory.findOneAndDelete({ categoryName: key });
    res.status(200).send({ data: "sucess" });
  });
});

module.exports = router;
