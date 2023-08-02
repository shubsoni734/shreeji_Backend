const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema(
  {
    silver: {
      type: String,
      required: true,
    },
    gold: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Rates", rateSchema);
