import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import { extractNaming, extractColorValue, extractDimensions, extractFontNaming, extractFontProperties } from './extractors'
import { convertToREM } from './helpers'
import { addColor, addSpacing, addFont } from './themeHandlers'

const webviewIdentifier = 'tailwind-config-exporter.webview'

let document = require('sketch/dom').getSelectedDocument()
let symbols = document.getSymbols()
let textStyles = document.sharedTextStyles
let layerStyles = document.sharedLayerStyles
let tailwindConfig = ""

export const theme = {}
theme.colors = {}
theme.spacing = {
  px: "1px",
  "0": "0"
}
theme.fontSize = {}


/*
  fontFamily: {
    sans: ["Inter let", ...defaultTheme.fontFamily.sans],
  },
   fontSize: {
      sm: ['14px', '20px'],
      base: ['16px', '24px'],
      lg: ['20px', '28px'],
      xl: ['24px', '32px'],
    }
*/

textStyles.forEach((style) => {
  if (style.styleType === 'Style') {
    const fontData = extractFontNaming(style);
    const fontStyles = extractFontProperties(style)
    addFont(fontData.sizing,fontStyles)
  }
});

symbols.forEach((symbol) => {
  let item = extractNaming(symbol)
  if (item.category === 'spacing') {
    let spacer = extractDimensions(symbol)
    if (spacer.height) {
      addSpacing(item, convertToREM(spacer.height))
    }
  }
});

layerStyles.forEach((layer) => {
  let item = extractNaming(layer)
  if (item.category === 'color') {
    let color = extractColorValue(layer)
    if (color) {
      addColor(item, color)
    }
  }
});


//TODO: refactori this down here sometimes, so its somewhere more fitting
// stringify and remove unecessary double quotes
tailwindConfig = JSON.stringify(theme, null, "\t").replace(/"([^"]+)":/g, '$1:')

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
  const configExport = "theme: " + tailwindConfig

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
