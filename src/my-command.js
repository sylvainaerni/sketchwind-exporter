import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import { extractNaming, extractColorValue, extractDimensions } from './extractors'
import { convertToREM } from './helpers'
import { addColor, addSpacing } from './themeHandlers'

const webviewIdentifier = 'tailwind-config-exporter.webview'

var document = require('sketch/dom').getSelectedDocument()
var symbols = document.getSymbols()
var textStyles = document.sharedTextStyles
var layerStyles = document.sharedLayerStyles
var tailwindConfig = ""

export const theme = {}
theme.colors = {}
theme.spacing = {
  px: "1px",
  "0": "0"
}
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
