const express = require("express");
const router = express.Router();
const { User, wallet } = require("../schema/registerSchema");
const { needCategory, needItem } = require("../schema/needSchema");

const { sessionAuth } = require("../backend/passport-config");
const path = require("path");

router.get("/updateCategoryN", sessionAuth, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../fontend/updatecategoryN.html"));
});

router.post("/updateCategoryN", sessionAuth, (req, res) => {
  const { key } = req.body;
  ultimates = key;
  res.send("hello");
});

router.get("/updateCategoryN/value", sessionAuth, (req, res) => {
  res.send(ultimates);
});

router.put("/updateCategoryNeed", sessionAuth, async (req, res) => {
  const { oldKey, newKey } = req.body;
  if (!(newKey == null || newKey == "")) {
    await needCategory.findOneAndUpdate(
      { categoryName: oldKey },
      { categoryName: newKey }
    );
    res.status(200).send({ data: "sucess" });
    return;
  }
  res.status(401).send("ERROR");
});

router.delete("/deleteCategoryNeed/:key", sessionAuth, async (req, res) => {
  const { key } = req.params;
  needCategory.find({ categoryName: key }).then(async (e) => {
    for (let i of e) {
      for (let item of i.items) {
        await needItem.findOneAndDelete({ _id: item.toString() });
      }
    }
    await needCategory.findOneAndDelete({ categoryName: key });
    res.status(200).send({ data: "sucess" });
  });
});

module.exports = router;
