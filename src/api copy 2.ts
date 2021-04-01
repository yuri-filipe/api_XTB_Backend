import WebSocket from "ws";
import axios from "axios";
import { inicio, reset, get } from "./timer";
import { Msg } from "./types";
import { calculoParametros, setNotificationStatus } from "./core";
import dotenv from "dotenv";
import { connect } from "mongoose";
dotenv.config();

const url = process.env.URL_REAL;

let sessionId = null;
export let keyServer = false;
let serverStatus = false;
export const setKeyServer = (value: boolean) => {
  keyServer = value;
};
export let database = {
  xtbStatus: null,
  data: {},
  max: {
    lucro: 0,
    prejuizo: 0,
  },
  timer: "00:00:00",
};

let msgLogin: Msg = {
  command: "login",
  arguments: {
    userId: process.env.USERID_REAL,
    password: process.env.PASSWORD,
  },
};

var send = null;

export default function socket() {
  let ws = new WebSocket(url);
  send = (message) => {
    try {
      var msg = JSON.stringify(message);

      ws.send(msg);
    } catch (Exception) {
      console.error(
        "Error ao enviar mensagem pelo Socket: " + Exception.message
      );
    }
  };
  console.log("Criando nova conexão");
  ws.onopen = function () {
    console.log("Abrindo Socket");
    // Login
    send(msgLogin);
    inicio(); //RELÓGIO
  };

  ws.onmessage = function (evt: any) {
    try {
      var response = JSON.parse(evt.data);
      if (response.status == true) {
        if (response.streamSessionId) {
          sessionId = response.streamSessionId;
          console.log("Socket conectado!");
          getMarginLevel();
        } else {
          if (response.returnData) {
            database.xtbStatus = sessionId;
            database.data = response.returnData;
            console.log(response.returnData);
            
            // database.max = calculoParametros(
            //   response.returnData.equity - response.returnData.balance
            // );
            database.timer = get();
          } else {
            database.xtbStatus = null;
            database.data = null;
            database.max = {
              lucro: 0,
              prejuizo: 0,
            };
            database.timer = "00:00:00";
          }
        }
      } else {
        alert("Error: " + response.errorDescr);
      }
    } catch (Exception) {
      alert("Fatal error while receiving data! :(");
    }
  };
  ws.onclose = function () {
    console.log("Socket desconectado");
    sessionId = null;
    setNotificationStatus(false);
    reset(); //RELÓGIO
    database = {
      xtbStatus: null,
      data: {},
      max: {
        lucro: 0,
        prejuizo: 0,
      },
      timer: "00:00:00",
    };
  };

  function getMarginLevel() {
    setInterval(() => {
      send({
        command: "getBalance",
      });
    }, 1000);
  }
}
export function disconnect() {
  console.log("Desconectando no Socket");
  send({
    command: "logout",
  });
}

setInterval(() => {
  // SE O SOCKET ESTÁ FECHADO E A CHAVE ESTÁ ABERTA, DEVERÁ SE RECONECTAR
  if (!database.xtbStatus && keyServer === true) {
    socket();
  }
}, 20000);
// 300000 = 5 minutos
