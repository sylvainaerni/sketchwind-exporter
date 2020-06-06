import { theme } from "./theme"
import { convertPxToREM } from "./helpers"

export const addColor = (item, colorValue) => {
  let name = item.item
  const variation = item.variation
  const value = colorValue

  if(name.startsWith("_"))  name = name.slice(1)
  // create color object if color doesn't exist
  if (!(name in theme.colors)) theme.colors[name] = {}
  // create color variation if it exists
  if (variation) {
    theme.colors[name][variation] = value
  } else {
    theme.colors[name] = value
  }
}



export const addSpacing = (item, spacingValue) => {
  if(!item.item) return
  const name = item.item
  const value = spacingValue
  // create spacing object if it doesn't exist
  if (!(name in theme.spacing)) theme.spacing[name] = {}
  theme.spacing[name] = value
}

export const addShadow = (name, shadowValue) => {
  if(!name) return
  // create boxShadow object if it doesn't exist
  if (!(name in theme.boxShadow)) theme.boxShadow[name]
  theme.boxShadow[name] = shadowValue
  theme.boxShadow.none = "none"
}



// todo: erase objects in other functions too, this is easier to read
// also todo: add the initialization of the modulat object, like border width in the function which adds them!!!!!!
export const addBorderWidth = (name, width) => {
  if(!name || !width) return
  if (!(name in theme.borderWidth)) theme.borderWidth[name] = {}
  theme.borderWidth[name] = width
}

export const addStroke = (name, width) => {
  if(!name || !width) return
  // create strokeWidth object if it doesn't exist
  if (!theme.strokeWidth) theme.strokeWidth = {0:0}
  if (!(name in theme.strokeWidth)) theme.strokeWidth[name] = {}
  theme.strokeWidth[name] = width
}

export const addFont = (fontStyleName, fontProperties) => {
  if(!fontStyleName) return
  const fontSize = convertPxToREM(fontProperties.fontSize)
  // if the lineheight is zero then we dont bother with a conversion
  const lineHeight = fontProperties.lineHeight ? convertPxToREM(fontProperties.lineHeight) : null
  if (!(fontStyleName in theme.fontSize)) theme.fontSize[fontStyleName] = {}
  // we want either sm: ['14px', '20px'], or sm:'14px',
  // this depends on the existance of the lineheight
  // ternary, if the new font has a lineheight generate the array object,
  // otherwise just add the font as string (god i wish this was typed)
  theme.fontSize[fontStyleName] = lineHeight ? [fontSize,lineHeight] :  fontSize
}


export const addScreen = (item, width) => {
  if (!item.item) return
  const name = item.item
  const value = width
  // create screens object if it doesn't exist
  if (!(name in theme.screens)) theme.screens[name] = {}
  theme.screens[name] = value
}


