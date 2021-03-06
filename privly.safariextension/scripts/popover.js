/**
 * @fileOverview This file provides for the menu that pops over when
 * you click on the Privly icon in the browser Safari.
 */

/**
 * Helper function for activateExtension() and deactivateExtension().
 *
 * @param {node} toShow The element that needs to be shown
 * @param {node} toHide The element that needs to be hidden
 */
function extensionStateChange(toShow, toHide) {

  /* istanbul ignore if */
  if (typeof safari !== "undefined" && safari.extension !== undefined) {
    safari.extension.globalPage.contentWindow.modalButton.modeChange();
  }

  // Update the UI
  $(toShow).show();
  $(toHide).hide();
}

/**
 * Activates application injection by messaging the background scripting
 * environment. The background scripting environment will then message
 * the privly.js content script.
 */
function activateExtension() {

  // Call the helper function to make necessary changes
  extensionStateChange("#deactivateExtension", "#activateExtension");

  // Change the toolbar item image to denote extension is on
  /* istanbul ignore if */
  if (typeof safari !== "undefined" && safari.extension !== undefined) {
    safari.extension.toolbarItems[0].image = safari.extension.baseURI + 'img/extension_on.png';
  }
}

/**
 * Deactivates application injection by messaging the background scripting
 * environment. The background scripting environment will then message
 * the privly.js content script.
 */
function deactivateExtension() {

  // Call the helper function to make necessary changes
  extensionStateChange("#activateExtension", "#deactivateExtension");

  // Change the toolbar item image to denote extension is off
  /* istanbul ignore if */
  if (typeof safari !== "undefined" && safari.extension !== undefined) {
    safari.extension.toolbarItems[0].image = safari.extension.baseURI + 'img/extension_off.png';
  }
}

/**
 * Helper function to open new tabs from the links.
 */
function openPopoverPage() {

  /* istanbul ignore if */
  if (typeof safari !== "undefined" && safari.application !== undefined) {
    safari.application.activeBrowserWindow.openTab().url = safari.extension.baseURI + this.getAttribute("data-popover-path");
  }
}

// Set the activation UI
$("#deactivateExtension").click(deactivateExtension);
$("#activateExtension").click(activateExtension);

// Open new windows from the links
$(".popover_data").click(openPopoverPage);
