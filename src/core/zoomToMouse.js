/**
 * https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#zoomToMouse__anchor
 * @fires fitModeUpdated on DocumentViewer
 * @see https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#event:fitModeUpdated__anchor
 * @fires zoomUpdated on DocumentViewer
 * @see https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#event:zoomUpdated__anchor
 */
export default zoomFactor => {
  // left panel width when it's not closed
  // it still maintains its width when closed
  const xOffset = document.querySelector('[data-element=leftPanel]:not(.closed)')?.offsetWidth || 0;

  // height of main header and the header tools that may appear below
  const headerHeight = document.querySelector('[data-element=header]')?.offsetHeight || 0;
  const headerToolsHeight = document.querySelector('[data-element=toolsHeader]')?.offsetHeight || 0;
  const yOffset = headerHeight + headerToolsHeight;

  window.docViewer.zoomToMouse(zoomFactor, xOffset, yOffset);
};
