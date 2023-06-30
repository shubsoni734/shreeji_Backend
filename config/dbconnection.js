const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({});

const dbconnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.mongo_url);
    console.log(`connecct to database ${conn}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbconnect;
