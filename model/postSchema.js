const mongoose = require("mongoose");
//Criando o schema Categoria

const PostSchema = mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    theme: { type: String },
    address: { type: String },
    photo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", PostSchema);
