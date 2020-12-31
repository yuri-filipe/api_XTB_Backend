import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import socket, { database, disconnect, setKeyServer } from "./api";
import dotenv from "dotenv";
dotenv.config();

import helmet from "helmet";
import {
  resetCore,
  setNotificationStatus,
  setStopLoss,
  setTakeProfit,
} from "./core";

const app = express();

//MIDLEWARES

// * CONEXÃO E AUTENTICAÇÃO COM A IQ
// 1º CONECTAR DE FORMA SINCRONA COM O SERVIDOR DA IQ E AUTENTICAR USUÁRIO
// 2º RETORNAR PELO CONSOLE SE TODAS AS CONEXÕES FORAM BEM SUCEDIDAS

// * SINCRONIZAÇÃO
// 1º FICAR DISPONÍVEL PARA AUTENTICAÇÃO DE USUÁRIO NO FRONTEND
// 2 º d
app.use(helmet());
app.use((req, res, next) => {
  //Cria um middleware onde todas as requests passam por ele
  if (req.headers["x-forwarded-proto"] == "http")
    //Checa se o protocolo informado nos headers é HTTP
    res.redirect(`https://${req.headers.host}${req.url}`);
  //Redireciona pra HTTPS
  //Se a requisição já é HTTPS
  else next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/v1/data", (req, res, next) => {
  const { token } = req.body;
  if (token === process.env.TOKEN) {
    res.json({ code: "sucess", value: database });
  } else {
    res.json({ code: "warning" });
  }
});
app.post("/api/v1/status", (req, res, next) => {
  const { token } = req.body;
  if (token === process.env.TOKEN) {
    res.json({ code: "sucess" });
  } else {
    res.json({ code: "warning" });
  }
});
app.post("/api/v1/stopNotification", (req, res, next) => {
  const { token } = req.body;
  if (token === process.env.TOKEN) {
    setNotificationStatus(false);

    res.json({ code: "sucess" });
  } else {
    res.json({ code: "warning" });
  }
});
app.post("/api/v1/params", (req, res, next) => {
  const { token, data } = req.body;
  if (token === process.env.TOKEN) {
    setTakeProfit(data.takeProfit); // define take
    setStopLoss(data.stopLoss); // define stop
    setKeyServer(true); // permite socket connectar
    setNotificationStatus(true);
    socket(); // inicia o socket
    res.json({ code: "sucess" });
  } else {
    res.json({ code: "warning" });
  }
});
app.post("/api/v1/stop", (req, res, next) => {
  const { token } = req.body;
  if (token === process.env.TOKEN) {
    resetCore()
    setKeyServer(false)
    setNotificationStatus(true)
    disconnect();
    res.json({ code: "sucess" });
  } else {
    res.json({ code: "warning" });
  }
});

app.listen(3000, () => console.log("Servidor em execução..."));
