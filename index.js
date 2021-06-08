const express = require("express");
const postRoute = require("./route/post");
const init = require("./config/db");
init();
const app = express();
app.disable("x-powered-by");

const PORT = process.env.PORT || 4000;

app.use(function (req, res, next) {
  //Em produção, remova o * e atualize com o domínio/ip do seu app
  res.setHeader("Access-Control-Allow-Origin", "*");
  //Cabeçalhos que serão permitidos
  res.setHeader("Access-Control-Allow-Headers", "*");
  //Ex: res.setHeader('Access-Control-Allow-Headers','Content-Type, Accept, access-token')
  //Métodos que serão permitidos
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "hello world",
    versao: "1.0.2",
  });
});

app.use("/public/:media", (req, res) => {
  res.sendFile(req.params.media, { root: "./public/uploads" });
});

app.use("/post", postRoute);

app.listen(PORT, (req, res) => {
  console.log(`💻 Servidor Web rodando na porta ${PORT}`);
});
