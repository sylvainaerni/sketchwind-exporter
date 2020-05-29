import { get } from 'lodash'
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
  console.log(get(layer,"style"));
  // assumption : we do not support multifill atm
  return layer.styles || null
}

export const extractColorValue = (layer) =>{
  // assumption : we do not support multifill atm
  return get(layer,"style.fills[0].color") || null
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

export const extractDimensions = (element) =>{
  // assumption : we do not support multifill atm
  return get(element,"frame") || null
}
