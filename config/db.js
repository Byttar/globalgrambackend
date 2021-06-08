const mongoose = require("mongoose");

const url = "mongodb+srv://byttar:kakizmongo@cluster0.y8vx4.mongodb.net/test";

const init = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected sucessfully");
  } catch (ex) {
    console.log(ex);
    throw ex;
  }
};

module.exports = init;
