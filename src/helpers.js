export const convertToREM = (value) => {
  return roundToTwo(value/16)+"rem"
}

function roundToTwo(num) {
  return +(Math.round(num + "e+2")  + "e-2");
}
