import BrowserWindow from 'sketch-module-web-view';
import { getWebview } from 'sketch-module-web-view/remote';
import UI from 'sketch/ui';
import { theme } from './theme';
import { extractNaming, extractColorValue, extractDimensions, extractFontNaming, extractFontProperties, extractBorderWidth, extractBorderRadius, extractShadows, extractArtboardWidth, extractOpacityValue } from './extractors';
import { convertPxToREM, convertIntToPX, convertColor, roundToTwo } from './helpers';
import { addColor, addSpacing, addFontSize, addFontFamily, addBorderWidth, addShadow, addStroke, addScreen, addBorderRadius, addOpacity } from './themeHandlers';

const webviewIdentifier = 'sketchwind-exporter.webview';

let document = require('sketch/dom').getSelectedDocument();
let symbols = document.getSymbols();
let textStyles = document.sharedTextStyles;
let layerStyles = document.sharedLayerStyles;
let tailwindConfig = '';

textStyles.forEach((style) => {
  if (style.styleType === 'Style') {
    const fontData = extractFontNaming(style);
    const fontStyles = extractFontProperties(style);
    addFontSize(fontData.sizing, fontStyles);
    addFontFamily(fontData.hierarchy, fontStyles.fontFamily)
  }
});

symbols.forEach((symbol) => {
  let item = extractNaming(symbol);

  if (item.variation && item.variation.includes("radius")) {
    const borderRadius = extractBorderRadius(symbol)
    addBorderRadius(item,borderRadius)
  }

  if (item.category === 'spacing') {
    let spacer = extractDimensions(symbol);
    if (spacer.height) {
      // the size 1 is in tailwind 1 pixel, not 1/16 rem
      if (spacer.height > 1) {
        addSpacing(item, convertPxToREM(spacer.height));
      } else {
        addSpacing(item, convertIntToPX(spacer.height));
      }
    }
  }
});

layerStyles.forEach((layer) => {
  let item = extractNaming(layer);
  if (item.category === 'strokeWidth') {
    let borderWidth = extractBorderWidth(layer);
    if (borderWidth) addStroke(borderWidth, convertIntToPX(borderWidth));
  }
  if (item.category === 'boxShadow') {
    let shadowDefinitions = extractShadows(layer);
    addShadow(item.item, shadowDefinitions.shadows);
  }
  if (item.category === 'borderWidth') {
    let borderWidth = extractBorderWidth(layer);
    if (borderWidth) addBorderWidth(borderWidth, convertIntToPX(borderWidth));
  }
  if (item.category === 'color') {
    let color = extractColorValue(layer);
    if (color) addColor(item, convertColor(color));
  }
  if (item.category === 'opacity') {
    let opacity = extractOpacityValue(layer);
    if (opacity) addOpacity(item, roundToTwo(opacity));
  }
});

document.pages.forEach((page) => {
  page.layers.forEach((layer) => {
    if (layer.type === 'Artboard') {
      let item = extractNaming(layer);
      if (item.category === 'screen') {
        let artboardWidth = extractArtboardWidth(layer);
        if (artboardWidth) addScreen(item, convertIntToPX(artboardWidth));
      }
    }
  });
});

//TODO: refactori this down here sometimes, so its somewhere more fitting
// stringify and remove unecessary double quotes
tailwindConfig = JSON.stringify(theme, null, 2).replace(/"([^"]+)":/g, '$1:');

export default function () {
  const options = {
    identifier: webviewIdentifier,
    width: 600,
    height: 850,
    show: false,
    titleBarStyle: 'hidden',
  };

  const browserWindow = new BrowserWindow(options);

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show();
  });

  const webContents = browserWindow.webContents;
  const configExport = 'theme: ' + tailwindConfig;

  // print a message when the page loads
  webContents.on('did-finish-load', () => {
    UI.message("Let's export your stuff!");
    webContents.executeJavaScript(`populateTextArea(${JSON.stringify(configExport)})`).catch(console.error);
  });

  // add a handler for a call from web content's javascript
  webContents.on('nativeLog', (s) => {
    UI.message(s);
    webContents.executeJavaScript(`copyToClipboard()`).catch(console.error);
  });

  browserWindow.loadURL(require('../resources/webview.html'));
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier);
  if (existingWebview) {
    existingWebview.close();
  }
}

function clone(json) {
  return JSON.parse(JSON.stringify(json));
}
