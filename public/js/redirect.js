var code = window.location.toString().replace(/.+code=/, '');
window.opener.postMessage(code, window.location);
// hack to close tab.
window.open('', '_self', '');
window.close();
