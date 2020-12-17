import axios from "axios";
import WebSocket from "ws";



const wsiq = new WebSocket("wss://iqoption.com/echo/websocket");

let ssid;
export const connectIq = async () => {
  try {
    const response = await axios.post(
      "https://auth.iqoption.com/api/v2/login",
      credentials,
      {
        headers: {
          "User-Agent": "Chrome/85.0.4183.121",
        },
      }
    );
    console.log("connecting...");

    console.log(`statusIq ==> ${response.status}`);
    ssid = response.data.ssid;
    while (!ssid) {
      setTimeout(() => {
        if (ssid) {
          wsiq.send(
            JSON.stringify({
              name: "ssid",
              msg: ssid,
            })
          );
        }
      }, 3000);
    }
    console.log(`Usuário conectado!`);
  } catch (error) {
    console.log(
      `Código do erro ==> ${error.response.status}, Status ==> ${error.response.statusText}`
    );
  }
};

wsiq.onopen = () => {
  setTimeout(() => {
    wsiq.send(
      JSON.stringify({
        name: "ssid",
        msg: ssid,
      })
    );
  }, 5000);
};
wsiq.on("message", (data) => {
  let d = JSON.parse(data);
  if (d.name === "candles") {
    let params = d.request_id.split("/");
    let res = candlesGenerator(d.msg.candles, Number(params[1]),params[3]);
    if (Number(params[2]) !== res[res.length - 1].id) {
      updateCandles(params[0], res);
    }
  }
});

export const getCandles = (
  pid: string,
  urlParidade: number,
  timeFrame: number,
  qtd: number,
  ultimoId: any
): any => {
  let params = `${pid}/${qtd}/${ultimoId}/${timeFrame}`;
  wsiq.send(
    JSON.stringify({
      name: "sendMessage",
      request_id: params,
      msg: {
        name: "get-candles",
        version: "2.0",
        body: {
          only_closed: true,
          active_id: urlParidade, // 1 = EUR/USD
          size: timeFrame, // 60 segundos
        },
      },
    })
  );
};

export default connectIq;
