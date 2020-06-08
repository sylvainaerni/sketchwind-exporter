import { theme } from "./theme"
import { convertPxToREM, convertToRgba, wrapDigitKey } from "./helpers"

export const addColor = (item, colorValue) => {
  let name = item.item
  const variation = item.variation
  const value = colorValue

  if(name.startsWith("_"))  name = name.slice(1)
  // create color object if color doesn't exist
  if (!(name in theme.colors)) theme.colors[wrapDigitKey(name)] = {}
  // create color variation if it exists
  if (variation) {
    theme.colors[wrapDigitKey(name)][variation] = value
  } else {
    theme.colors[wrapDigitKey(name)] = value
  }
}



export const addSpacing = (item, spacingValue) => {
  if(!item.item) return
  const name = item.item
  const value = spacingValue
  // create spacing object if it doesn't exist
  if (!(name in theme.spacing)) theme.spacing[wrapDigitKey(name)] = {}
  theme.spacing[wrapDigitKey(name)] = value
}

export const addShadow = (name, shadowValue) => {
  if(!name) return

  // create boxShadow object if it doesn't exist
  if (!(name in theme.boxShadow)) theme.boxShadow[wrapDigitKey(name)]

  // convert rrggbbaa colors to rgba
  let regex = /#[0-9a-f]{8}/gi
  let convertedShadowValue = shadowValue.replace(regex, convertToRgba)
  theme.boxShadow[wrapDigitKey(name)] = convertedShadowValue

  theme.boxShadow.none = "none"
}



// todo: erase objects in other functions too, this is easier to read
// also todo: add the initialization of the modulat object, like border width in the function which adds them!!!!!!
export const addBorderWidth = (name, width) => {
  if(!name || !width) return
  if (!(name in theme.borderWidth)) theme.borderWidth[wrapDigitKey(name)] = {}
  theme.borderWidth[wrapDigitKey(name)] = width
}

export const addStroke = (name, width) => {
  if(!name || !width) return
  // create strokeWidth object if it doesn't exist
  if (!theme.strokeWidth) theme.strokeWidth = {0:0}
  if (!(name in theme.strokeWidth)) theme.strokeWidth[wrapDigitKey(name)] = {}
  theme.strokeWidth[wrapDigitKey(name)] = width
}

export const addFont = (fontStyleName, fontProperties) => {
  if(!fontStyleName) return
  const fontSize = convertPxToREM(fontProperties.fontSize)
  // if the lineheight is zero then we dont bother with a conversion
  const lineHeight = fontProperties.lineHeight ? convertPxToREM(fontProperties.lineHeight) : null
  if (!(fontStyleName in theme.fontSize)) theme.fontSize[wrapDigitKey(fontStyleName)] = {}
  // we want either sm: ['14px', '20px'], or sm:'14px',
  // this depends on the existance of the lineheight
  // ternary, if the new font has a lineheight generate the array object,
  // otherwise just add the font as string (god i wish this was typed)
  theme.fontSize[wrapDigitKey(fontStyleName)] = lineHeight ? [fontSize,lineHeight] :  fontSize
}


export const addScreen = (item, width) => {
  if (!item.item) return
  const name = item.item
  const value = width

  // create screens object if it doesn't exist
  if (!(name in theme.screens)) theme.screens[wrapDigitKey(name)] = {}

  theme.screens[wrapDigitKey(name)] = value
}


