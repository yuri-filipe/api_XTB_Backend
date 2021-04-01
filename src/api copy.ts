import WebSocket from "ws";
import axios from "axios";
import { inicio, reset, get } from "./timer";
import { Msg } from "./types";
import { calculoParametros, setNotificationStatus } from "./core";
import dotenv from "dotenv";
import { connect } from "mongoose";
dotenv.config();

const url = "wss://ws.xtb.com/realStream";

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

let msgLogin: any = {
  command: "getProfits",
  streamSessionId: "",
};

var send = null;

export default function socket2(sessionId: any) {
  msgLogin.streamSessionId = sessionId;
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
  console.log("Criando nova conexão 2 ");
  ws.onopen = function () {
    console.log("Abrindo Socket 2 ");
    // Login
    send(msgLogin);
    
    inicio(); //RELÓGIO
  };

  ws.onmessage = function (evt: any) {
    try {
      var response = JSON.parse(evt.data);
      console.log(response);
      

    } catch (Exception) {
      alert("Fatal error while receiving data! :(");
    }
  };
  ws.onclose = function () {
    console.log("Socket desconectado 2");
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

 
}
export function disconnect() {
  console.log("Desconectando no Socket");
  send({
    command: "logout",
  });
}
