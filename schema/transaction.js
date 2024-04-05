const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactions = new Schema({
  Tname: {
    type: String,
    required: true,
  },
  Tcategory: {
    type: String,
    required: true,
  },
  TDates: {
    type: String,
  },
  Tprice: {
    type: Number,
    required: true,
  }
});

const transactionHistory = mongoose.model("transaction", transactions);

module.exports = transactionHistory;
