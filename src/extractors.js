import { get } from 'lodash'
import { convertIntToPX } from './helpers';
// split layer name and extract the data needed
// example: 'colors/gray/900'
// item[0] is the 'category'              'colors'
// item[1] is the item itself             'gray'
// item[2] is the key for variation       '900'
export const extractNaming = (element)=>{
  const [category, item, variation] = element.name.replace(/\/\s*$/, '').split('/');
  return {
    category: category,
    item: item,
    variation: variation
  }
}

// example: sm/primary/regular/right
export const extractFontNaming = (element)=>{
  const [sizing, hierarchy, weight, alignment] = element.name.replace(/\/\s*$/, '').split('/');
  return {
    sizing: sizing,
    hierarchy: hierarchy,
    weight: weight,
    alignment: alignment
  }
}


// lets see if we ever use this ¯\_(ツ)_/¯
export const extractStyles = (layer) =>{
  //unperformant af, need to find a way: let styles = clone(layer.style)
  const styles = get(layer,"styles") | null
  const color = get(styles,".fills[0].color") | null
  const shadows = styles.shadows
  // assumption : we do not support multifill atm
  return layer.styles || null
}

export const extractColorValue = (layer) =>{
  // assumption : we do not support multifill atm
  return get(layer,"style.fills[0].color") || null
}

/***
y: 4
color: #0000000d
blur: 6
enabled: true
x: 0
spread: -2
* **/

export const extractShadows = (layer) =>{
  // sketch shadows are very abstract and fragmented
  let sketchShadows = get(layer,"style.shadows")
  let sketchInnerShadows = get(layer,"style.innerShadows")
  // shadows can be layered
  let shadows = sketchShadows.map(_ => {
    /* offset-x | offset-y | blur-radius | spread | color */
    return `${convertIntToPX(_.x)} ${convertIntToPX(_.y)} ${convertIntToPX(_.blur)} ${convertIntToPX(_.spread)} ${_.color}`
  }).join(", ")

  let innerShadows = sketchInnerShadows.map(_ => {
    /* offset-x | offset-y | blur-radius | color */
    return `${convertIntToPX(_.x)} ${convertIntToPX(_.y)} ${convertIntToPX(_.blur)} ${convertIntToPX(_.spread)} ${_.color}`
  }).join(", ")

  return {
    shadows:shadows,
    innerShadows:innerShadows
  }
}

export const extractBorderWidth = (layer) =>{
  // assumption : we do not support multifill atm
  return get(layer,"style.borders[0].thickness") || null
}

export const extractFontProperties = (SharedStyle) =>{
  const style = SharedStyle.style
  const { fontSize,textColor,fontWeight,alignment,lineHeight } = style;
  return {
    fontSize:fontSize,
    textColor:textColor,
    fontWeight:fontWeight,
    alignment:alignment,
    lineHeight:lineHeight
  }
}

export const extractDimensions = (element) => {
  // assumption : we do not support multifill atm
  return get(element, "frame") || null
}

export const extractArtboardWidth = (layer) => {
  return get(layer, "frame.width") || null
}

