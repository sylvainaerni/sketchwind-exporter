export const convertPxToREM = (value) => {
  return roundToTwo(value/16)+"rem"
}

export const convertRemToPX = (value) => {
  return roundToTwo(value*16)+"rem"
}

export const convertIntToPX = (value) => {
  return value+"px"
}

export const convertColor = (value) => {
  // test if rrggbbaa color has tranparency
  if (value.substr(-2) === 'ff') {
    return convertToSimpleHex(value)
  }
  else {
    return convertToRgba(value)
  }
}

export const convertToRgba = (color) => {
  let value = color.substring(1, 9)
  let red = parseInt(value.substring(0, 2), 16)
  let green = parseInt(value.substring(2, 4), 16)
  let blue = parseInt(value.substring(4, 6), 16)
  let alpha = Math.round((parseInt(value.substring(6, 8), 16) / 255) * 100) / 100;
  return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")"
}

function roundToTwo(num) {
  return +(Math.round(num + "e+2")  + "e-2");
}

function convertToSimpleHex(value) {
  return value.substring(0, 7)
}

