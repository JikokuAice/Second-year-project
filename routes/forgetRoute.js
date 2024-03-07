const express = require("express");
const router = express.Router();
const { User } = require("../schema/registerSchema");
const path = require("path");

router.get("/", (req, res) => {
  if (req.user) {
    return res.redirect("/home");
  }
  res.sendFile(path.resolve(__dirname, "../fontend/changePass.html"));
});

router.post("/", async (req, res) => {
  const { username, oldpassword, newpassword } = req.body;
  try {
    let user = await User.find({ username: username });
    console.log(user);
    if (!user) {
      return res.sendFile(path.resolve(__dirname, "../redirect/auth.html"));
    }

    if (!user.password == oldpassword) {
      return res.redirect("/");
    }

    await User.findOneAndUpdate(
      { username: username },
      { password: newpassword }
    );
    return res.sendFile(path.resolve(__dirname, "../redirect/password.html"));
  } catch (err) {
    res.sendFile(path.resolve(__dirname, "../redirect/serverErr.html"));
  }
});

module.exports = router;
