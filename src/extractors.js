import { get } from 'lodash'
// split layer name and extract the data needed
// example: 'colors/gray/900'
// item[0] is the 'category'              'colors'
// item[1] is the item itself             'gray'
// item[2] is the key for variation       '900'
export const extractNaming = (element)=>{
  const item = element.name.replace(/\/\s*$/, '').split('/');
  return {
    ...item[0] && {category: item[0]},
    ...item[1] && {item: item[1]},
    ...item[2] && {variation: item[2]},
  }
}

export const extractStyles = (layer) =>{
  var delve = require('delve')
  //unperformant af, need to find a way: let styles = clone(layer.style)
  const styles = delve(layer,"styles") | null
  const color = delve(styles,".fills[0].color") | null
  const shadows = styles.shadows
  console.log(delve(layer,"style"));
  // assumption : we do not support multifill atm
  return layer.styles | null
}

export const extractColorValue = (layer) =>{
  // assumption : we do not support multifill atm
  return get(layer,"style.fills[0].color") || null
}

export const extractDimensions = (element) =>{
  // assumption : we do not support multifill atm
  return get(element,"frame") || null
}
