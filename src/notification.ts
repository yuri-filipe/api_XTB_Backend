import https from "https";
import dotenv from "dotenv";
import { setNotificationStatus } from "./core";
dotenv.config();
const send = (data) => {
  const options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: process.env.AUTORIZATION,
    },
  };

  const req = https.request(options, (res) => {
    res.on("data", (data) => {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });

  req.on("error", (e) => {
    console.log("ERROR:");
    console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
};

export default function sendNotification(msg: string) {
  const message = {
    app_id: process.env.ID_ANDROID,
    contents: { en: msg },
    included_segments: ["Subscribed Users"],
    android_channel_id: "eb2651b1-fe95-49a1-b24f-7a5e9819c5ab",
  };
  send(message);
}
