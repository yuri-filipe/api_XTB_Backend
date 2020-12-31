import sendNotification from "./notification";

let maxLucro = 0;
let maxPrejuizo = 0;
let takeProfit = 1000000;
let initCore = true;
let stopLoss = -100000;
let notificationStatus = false;
export const setNotificationStatus = (value: boolean) => {
  notificationStatus = value;
};
export const setMaxLucro = (value: number) => {
  maxLucro = value;
};
export const setMaxPrejuizo = (value: number) => {
  maxPrejuizo = value;
};
export const setTakeProfit = (value: number) => {
  takeProfit = value;
};
export const setStopLoss = (value: number) => {
  stopLoss = value;
};
export const calculoParametros = (lucro: number) => {
  calcMax(lucro);
  if (lucro >= takeProfit) {
    notificationStatus
      ? sendNotification("O seu TAKE-PROFIT foi atingido...")
      : "";
  } else if (lucro <= stopLoss) {
    notificationStatus
      ? sendNotification("O seu STOP-LOSS foi atingido...")
      : "";
  }
  return { lucro: maxLucro, prejuizo: maxPrejuizo };
};

const calcMax = (value: number) => {
  if (initCore) {
    maxLucro = value;
    maxPrejuizo = value;
    initCore = false
  }

  if (value > maxLucro) {
    maxLucro = value;
  }
  if (value < maxPrejuizo) {
    maxPrejuizo = value;
  }
};
export const resetCore = () => {
  initCore = true
  maxLucro = 0;
  maxPrejuizo = 0;
  takeProfit = 1000000;
  stopLoss = -100000;
};
