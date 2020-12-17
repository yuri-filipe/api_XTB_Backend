import WebSocket from 'ws'
import axios from "axios";
import { Msg } from './types'

const url = "wss://ws.xtb.com/real";
let sessionId: string
const ws = new WebSocket(url);
//userId: "11655300",
//userId: "1579804",
let msgLogin: Msg = {
    command: "login",
    arguments: {
        userId: "1579804",
        password: "Conta22641127"
    }
}


function connect() {
    console.log('Conectando no Socket');
    ws.onopen = function () {
        console.log('Socket Conectado');
        // Login
        console.log("Autenticando");
        send(msgLogin);
    };

};

ws.onmessage = function (evt) {


    try {
        var response = JSON.parse(evt.data);

        if (response.status == true) {
            if (response.streamSessionId) {
                sessionId = response.streamSessionId
                console.log("User conectado!")
                getMarginLevel()
            }
            else {
                response.returnData ? calcLucro(response.returnData) : ""
            }


        }


        else {
            alert('Error: ' + response.errorDescr);
        }
    } catch (Exception) {
        alert('Fatal error while receiving data! :(');
    }
}
ws.onclose = function () {
    console.log('Connection closed');
};



const send = (message) => {
    try {
        var msg = JSON.stringify(message);
        ws.send(msg);

    } catch (Exception) {
        console.error('Error ao enviar mensagem pelo Socket: ' + Exception.message);
    }
}



function getMarginLevel() {
    setInterval(() => {
        send({
            command: "getMarginLevel",
        });
    }, 1000)
}



const calcLucro = (res) => {
    let soma = Number(res.equity - res.balance)

    console.log("Lucro => " + soma.toFixed(2))
}
connect();