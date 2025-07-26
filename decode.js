(function() {
    const selection = window.getSelection();
    let selectedText = selection.toString();

    if (!selectedText.trim()) return;

    // Add a space to the end of the selected text to ensure the last character is decoded correctly
    selectedText = selectedText + ' ';

    // Check if the selected text is valid Morse code using the function from morse.js
    if (typeof isValidMorse === 'function' && isValidMorse(selectedText)) {
      const decodedText = morseToText(selectedText);
      
      // Get the active element and replace the text
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT")) {
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        activeElement.value = activeElement.value.substring(0, start) + decodedText + activeElement.value.substring(end);
      } else {
        // For contenteditable elements or other text on the page
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(decodedText));
      }
    } else {
      alert("No Morse code detected.");
    }
  })();