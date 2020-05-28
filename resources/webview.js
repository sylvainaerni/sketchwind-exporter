// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

// actions
document.getElementById('button').addEventListener('click', () => {
  window.postMessage('nativeLog', 'Copied to the clipboard ')
})

window.populateTextArea = function (arg) {
  document.getElementById('textarea-output').value = arg
}

window.copyToClipboard = () => {
  document.getElementById('textarea-output').select()
  document.execCommand('copy')

  var validationMessage = document.getElementById('validation-message')
  validationMessage.classList.add('validation--visible')
  setTimeout(function () {
    validationMessage.classList.remove('validation--visible')
  }, 5000);
}

document.getElementById('close').addEventListener('click', () => {
  window.close('', '_parent', '');
})