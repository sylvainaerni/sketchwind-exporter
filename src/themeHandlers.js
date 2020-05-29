import { theme } from "./my-command"
import { convertToREM } from "./helpers"

export const addColor = (item, colorValue) => {
  var newColor = {}
  newColor.name = item.item
  newColor.variation = item.variation
  newColor.value = colorValue

  // create color object if color doesn't exist
  if (!(newColor.name in theme.colors)) theme.colors[newColor.name] = {}
  // create color variation if it exists
  if (newColor.variation) {
    theme.colors[newColor.name][newColor.variation] = newColor.value
  } else {
    theme.colors[newColor.name] = newColor.value
  }
}


export const addSpacing = (item, spacingValue) => {
  if(!item.item) return
  var newSpacing = {}
  newSpacing.name = item.item
  newSpacing.value = spacingValue

  // create spacing object if it doesn't exist
  if (!(newSpacing.name in theme.spacing)) theme.spacing[newSpacing.name] = {}
  theme.spacing[newSpacing.name] = newSpacing.value
}

export const addFont = (fontStyleName, fontProperties) => {
  if(!fontStyleName) return
  var newFont = {}
  newFont.fontSize = convertToREM(fontProperties.fontSize)
  // if the lineheight is zero then we dont bother with a conversion
  newFont.lineHeight = fontProperties.lineHeight ? convertToREM(fontProperties.lineHeight) : null
  if (!(fontStyleName in theme.fontSize)) theme.fontSize[fontStyleName] = {}
  // we want either sm: ['14px', '20px'], or sm:'14px',
  // this depends on the existance of the lineheight
  theme.fontSize[fontStyleName] = newFont.lineHeight ? [newFont.fontSize,newFont.lineHeight] :  newFont.fontSize
}


