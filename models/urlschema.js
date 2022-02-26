const mongoose = require("mongoose");
const url = mongoose.Schema([
  {
    longurl: {
      type: String,
      required: true,
    },
  },
  {
    shorturl: { type: String, unique: true },
  },
  {
    count: {
      type: Number,
      default: 0,
    },
  },
]);
const myUrl = mongoose.model("myurl", url);
module.exports = myUrl;
