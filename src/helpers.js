export const convertPxToREM = (value) => {
  return roundToTwo(value/16)+"rem"
}

export const convertRemToPX = (value) => {
  return roundToTwo(value*16)+"rem"
}

export const convertIntToPX = (value) => {
  return value+"px"
}

function roundToTwo(num) {
  return +(Math.round(num + "e+2")  + "e-2");
}
