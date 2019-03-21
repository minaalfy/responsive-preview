export function getComputedBodyStyle(prop, contentWindow) {
  var
    el = contentWindow.document.body,
    retVal = 0;
  if (contentWindow.document.defaultView && contentWindow.document.defaultView.getComputedStyle) {
    retVal = contentWindow.document.defaultView.getComputedStyle(el, null)[prop];
  }
  return parseInt(retVal, 10);
}

export default function getIFrameHeight(contentWindow) {
  return contentWindow.document.body.offsetHeight +
    getComputedBodyStyle('marginTop', contentWindow) +
    getComputedBodyStyle('marginBottom', contentWindow);
}