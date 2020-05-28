import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'

const webviewIdentifier = 'tailwind-config-exporter.webview'

var document = require('sketch/dom').getSelectedDocument()
var symbols = document.getSymbols()
var textStyles = document.sharedTextStyles
var layerStyles = document.sharedLayerStyles
var tailwindConfig = ""

const theme = {}
theme.colors = {}
theme.fontSize = {}


console.log("layerStyles.length", layerStyles.length);


textStyles.forEach((style) => {

  if (style.styleType === 'Style') {
    var fontSize = style.style.fontSize

    var name = style.name.split("/")[0]

    //console.log('fontSize', fontSize, name)
    // console.log('test style', style)
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



// get infos from each layer styles with a name starting with 'color/' or 'spacings/':
layerStyles.forEach((layer) => {
  // split layer name:            example: 'colors/gray/900'
  // item[0] is the 'category'              'colors'
  // item[1] is the item itself             'gray'
  // item[2] is the key for variation       '900'

  var item = layer.name.replace(/\/\s*$/, '').split('/');

  //console.log(item[0])

  if (item[0] === 'color') {
    var color = layer.style.fills[0].color
    if (color) {
      addColor(item, color)
    }

  } else if (item[0] === 'spacing') {
    addSpacing(item, 'mySizeHere')
  }
});


// stringify and remove unecessary double quotes
tailwindConfig = JSON.stringify(theme, null, "\t").replace(/"([^"]+)":/g, '$1:')


function addColor(item, colorValue) {
  var newColor = {}
  newColor.name = item[1]
  newColor.variation = item[2]
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

function addSpacing(item, spacingValue) {
  // TODO some stuff here to export the spacings
  // console.log('create spacing config here', item, spacingValue)
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
