const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json()); // for parsing application/json

const path = require("path");
const passport = require("passport");
const Esession = require("express-session");
const { User, wallet } = require("./schema/registerSchema");

const { mongoose } = require("mongoose");
const statics = path.join(__dirname, "fontend");
//routes
const homeRoute = require("./routes/homeRoute");
const forgetRoute = require("./routes/forgetRoute");
const addCategoryRoute = require("./routes/addCategoryRoute");
const needsRoute = require("./routes/needsRoute");
const wantRoute = require("./routes/wantsRoute");
const nCategoryUpdateRoute = require("./routes/nCategoryUpdateRoute");
const wCategoryUpdateRoute = require("./routes/wCategoryUpdateRoute");

const dbu =
  "mongodb+srv://Ayush:Ayushlac321@cluster1.eqgfnr5.mongodb.net/Register?retryWrites=true&w=majority";
mongoose
  .connect(dbu)
  .then((r) => {
    return app.listen(5000, () => {
      console.log("server is working");
    });
  })
  .catch((err) => {
    console.log(err);
  });

const { needCategory, needItem } = require("./schema/needSchema");
const { wantCategory, wantItem } = require("./schema/wantSchema");

const { localAuth, sessionAuth } = require("./backend/passport-config");
localAuth(passport);

app.use(express.static(statics));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  Esession({
    secret: "aice",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
//routes
app.use("/home", homeRoute);
app.use("/forget", forgetRoute);
app.use("/addcategory", addCategoryRoute);
app.use("/needs", needsRoute);
app.use("/wants", wantRoute);
app.use("/", nCategoryUpdateRoute);
app.use("/", wCategoryUpdateRoute);

app.locals.ultimates = null;
app.locals.needItemName = null;
app.locals.needItemPrice = null;
app.locals.wantItemName = null;
app.locals.wantItemPrice = null;
app.locals.wantUpdate = null;

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./fontend/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./fontend/signin.html"));
});

// app.get('/need',())

//for handling post req of registration
app.post("/signup", async (req, res) => {
  let { name, username, password1 } = req.body;
  let user = await User.findOne({ username: username });

  if (user) {
    return res.sendFile(path.resolve(__dirname, "./redirect/userExist.html"));
  }

  try {
    const signup = new User({
      name: name,
      username: username,
      password: password1,
    });
    signup
      .save()
      .then((r) => {
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  } catch (err) {
    res.sendFile(path.resolve(__dirname, "./redirect/serverErr.html"));
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/failure",
    successRedirect: "/home",
  }),
  (req, res) => {}
);

app.get("/failure", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./redirect/auth.html"));
});

app.post("/logout", (req, res, next) => {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

app.get("/aboutUs", sessionAuth, (req, res) => {
  res.sendFile(path.resolve("./fontend/contact.html"));
});

app.get("/updateItemNeed", sessionAuth, (req, res) => {
  res.sendFile(path.resolve(__dirname, "./fontend/needItemUpdate.html"));
});

app.get("/updateItemWant", sessionAuth, (req, res) => {
  res.sendFile(path.resolve(__dirname, "./fontend/wantItemUpdate.html"));
});

app.post("/updateItemNeed", sessionAuth, (req, res) => {
  const { key } = req.body;
  needItemName = key.split(",")[0];
  needItemPrice = key.split(",")[1];
  res.status(200).send("sucessfull");
});

app.get("/updateItemNeed/values", sessionAuth, (req, res) => {
  res.send({ needItemName, needItemPrice });
});

app.put("/updateItemNeed/values", sessionAuth, async (req, res) => {
  const { oldName, oldPrice, newName, newPrice } = req.body;
  let fetch = await needItem.findOneAndUpdate(
    { itemName: oldName, itemprice: oldPrice },
    { itemName: newName, itemprice: newPrice }
  );
  res.send(fetch);
});

app.delete("/updateItemNeed/values", sessionAuth, async (req, res) => {
  const { oldName, oldPrice } = req.body;
  await needItem.findOneAndDelete({ itemName: oldName, itemprice: oldPrice });
  res.send("sucessfull");
});

//want page

app.post("/updateItemWant", sessionAuth, (req, res) => {
  const { key } = req.body;
  wantItemName = key.split(",")[0];
  wantItemPrice = key.split(",")[1];
  res.status(200).send("sucessfull");
});

//this is for displaying old item name and price in wantItemUpdate page forms.
app.get("/updateItemWant/values", sessionAuth, (req, res) => {
  res.send({ wantItemName, wantItemPrice });
});

app.put("/updateItemWant/values", sessionAuth, async (req, res) => {
  const { oldName, oldPrice, newName, newPrice } = req.body;
  await wantItem.findOneAndReplace(
    { itemName: oldName, itemprice: oldPrice },
    { itemName: newName, itemprice: newPrice }
  );
  res.send("sucessfull");
});

app.delete("/updateItemWant/values", async (req, res) => {
  const { oldName, oldPrice } = req.body;
  await wantItem.findOneAndDelete({ itemName: oldName, itemprice: oldPrice });
  res.send("successfull");
});

app.post("/updateItemNeed/calculate", sessionAuth, async (req, res) => {
  const { key, newNeed, newExpenses } = req.body;
  await wallet.findByIdAndUpdate(
    { _id: key },
    { Needs: newNeed, expense: newExpenses }
  );
  res.status(200).send("success");
});

app.post("/updateItemWant/calculate", sessionAuth, async (req, res) => {
  const { key, newWant, newExpenses } = req.body;
  await wallet.findByIdAndUpdate(
    { _id: key },
    { Wants: newWant, expense: newExpenses }
  );
  res.status(200).send("success");
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./redirect/page404.html"));
});
