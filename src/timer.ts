let c: any = 0;
let s: any = 0;
let m: any = 0;
let h: any = 0;
let time = {
  horas: "00",
  minutos: "00",
  segundos: "00",
};
var control;
export const inicio = () => {
  control = setInterval(cronometro, 10);
};

export const reset = () => {
  clearInterval(control);
  c = 0;
  s = 0;
  m = 0;
  h = 0;
  time = {
    horas: "00",
    minutos: "00",
    segundos: "00",
  };
};
export const cronometro = () => {
  if (c < 99) {
    c++;
    if (c < 10) {
      c = "0" + c;
    }
  }
  if (c == 99) {
    c = -1;
  }
  if (c == 0) {
    s++;
    if (s < 10) {
      s = "0" + s;
    }
    time.segundos = s;
  }
  if (s == 59) {
    s = -1;
  }
  if (c == 0 && s == 0) {
    m++;
    if (m < 10) {
      m = "0" + m;
    }
    time.minutos = m;
  }
  if (m == 59) {
    m = -1;
  }
  if (c == 0 && s == 0 && m == 0) {
    h++;
    if (h < 10) {
      h = "0" + h;
    }
    time.horas = h;
  }
};
export const get = () => {
  const { horas, minutos, segundos } = time;
  return `${horas}:${minutos}:${segundos}`;
};
