import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import { extractNaming, extractColorValue, extractDimensions } from './extractors'
import { convertToREM } from './helpers'

const webviewIdentifier = 'tailwind-config-exporter.webview'

var document = require('sketch/dom').getSelectedDocument()
var symbols = document.getSymbols()
var textStyles = document.sharedTextStyles
var layerStyles = document.sharedLayerStyles
var tailwindConfig = ""

const theme = {}
theme.colors = {}
theme.spacing = {}
theme.fontSize = {}

textStyles.forEach((style) => {
  if (style.styleType === 'Style') {
    var fontSize = style.style.fontSize
    var name = style.name.split("/")[0]
  }
});

/*
  fontFamily: {
    sans: ["Inter var", ...defaultTheme.fontFamily.sans],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '4rem',
  },
*/


symbols.forEach((symbol) => {
  let item = extractNaming(symbol)
  if (item.category === 'spacings') {
    let spacer = extractDimensions(symbol)
    if (spacer.height) {
      console.log(item);
      addSpacing(item, convertToREM(spacer.height))
    }
  }
});

// get infos from each layer styles with a name starting with 'color/' or 'spacings/':
layerStyles.forEach((layer) => {
  let item = extractNaming(layer)
  if (item.category === 'color') {
    let color = extractColorValue(layer)
    if (color) {
      addColor(item, color)
    }
  }
});

// stringify and remove unecessary double quotes
tailwindConfig = JSON.stringify(theme, null, "\t").replace(/"([^"]+)":/g, '$1:')


function addColor(item, colorValue) {
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

/**
 *
 * spacing: {
      px: "1px",
      "0": "0",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "8": "2rem",
      "10": "2.5rem",
      "12": "3rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "32": "8rem",
      "40": "10rem",
      "48": "12rem",
      "56": "14rem",
      "64": "16rem",
      "128": "32rem"
    },
 * ***/

function addSpacing(item, spacingValue) {
  // TODO some stuff here to export the spacings
  console.log(spacingValue);
  console.log(item);
  if(!item.item) return
  var newSpacing = {}
  newSpacing.name = item.item
  newSpacing.value = spacingValue

  // create spacing object if it doesn't exist
  if (!(newSpacing.name in theme.spacing)) theme.spacing[newSpacing.name] = {}
  theme.spacing[newSpacing.name] = newSpacing.value

}

export default function () {
  const options = {
    identifier: webviewIdentifier,
    width: 600,
    height: 450,
    show: false,
    titleBarStyle: 'hidden'
  }


  const browserWindow = new BrowserWindow(options)

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  })

  const webContents = browserWindow.webContents
  const configExport = "themed: " + tailwindConfig

  // print a message when the page loads
  webContents.on('did-finish-load', () => {
    UI.message('Let\'s export your stuff!')
    webContents
      .executeJavaScript(`populateTextArea(${JSON.stringify(configExport)})`)
      .catch(console.error)
  })

  // add a handler for a call from web content's javascript
  webContents.on('nativeLog', s => {
    UI.message(s)
    webContents
      .executeJavaScript(`copyToClipboard()`)
      .catch(console.error)
  })

  browserWindow.loadURL(require('../resources/webview.html'))
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}


function clone(json) {
  return JSON.parse(JSON.stringify(json))
}
