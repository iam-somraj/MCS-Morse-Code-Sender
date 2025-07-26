chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "decode-morse",
    title: "Decode Morse Code",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "decode-morse") {
    // Inject both morse.js and decode.js to ensure the decoding logic has access to the dictionary functions.
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['morse.js', 'decode.js']
    });
  }
});