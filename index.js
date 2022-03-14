const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const myUrl = require("./models/urlschema");
const MongoClient = require("mongodb").MongoClient;
require("dotenv/config");
//bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
//middleware
app.use(express.static("public"));
//router-config
app.set("view engine", "ejs");
//router
//get and show datas in collection that already stored
app.get("/", (req, res) => {
  const data = myUrl.find((err, data) => {
    res.render("index", { info: data });
  });
});
//create short url
app.post("/create", (req, res) => {
  const myurl = new myUrl({
    longurl: req.body.longurl,
    shorturl: getRandom(),
  });
  const data = myurl.save((err, data) => {
    if (err) throw err;
    console.log(data);
    res.redirect("/");
  });
  console.log("saved......!");
});
//update total click when clicking short url
app.get("/:short", (req, res) => {
  myUrl.findOne({ shorturl: req.params.short }, (err, data) => {
    myUrl.findByIdAndUpdate(
      { _id: data._id },
      { $inc: { count: 1 } },
      (err, updatedData) => {
        if (err) throw error;
        res.redirect(data.longurl);
      }
    );
  });
});
//delete data
app.get("/delete/:id", (req, res) => {
  myUrl.findByIdAndDelete({ _id: req.params.id }, (err, deletedata) => {
    if (err) throw err;
    res.redirect("/");
  });
});
//server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("application is started");
});
//database connection

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
//local-db
/*
mongoose.connect("mongodb//127.0.0.1:27017/urlshortner", (err) => {
  if (err) throw err;
  console.log("DB connected");
});
*/
//remote-db
mongoose.connect(
  "mongodb+srv://dharwin:9715928749@dharwin.wkbz4.mongodb.net/url-compressor?retryWrites=true&w=majority",
  (err) => {
    if (err) throw err;
    console.log("DB connected");
  }
);

function getRandom() {
  var ranValue = "";
  const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charLen = char.length;
  for (let i = 0; i < 5; i++) {
    ranValue += char.charAt(Math.floor(Math.random() * charLen));
  }
  return ranValue;
}
