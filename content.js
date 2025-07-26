// Function to create and show the "En" button
function showEncodeButton(inputElement) {
  // If a button already exists, remove it before creating a new one
  const existing = document.querySelector(".morse-extension-btn");
  if (existing) existing.remove();

  const button = document.createElement("button");
  button.textContent = "En";
  button.style.position = "absolute";
  button.style.zIndex = "9999";
  button.style.padding = "3px 8px";
  button.style.fontSize = "12px";
  button.style.background = "#204BCC";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "4px";
  button.style.cursor = "pointer";
  button.style.right = "5px";
  button.style.bottom = "5px";

  button.addEventListener("click", () => {
    // Get the element's current text
    const isContentEditable = inputElement.isContentEditable;
    const textToEncode = isContentEditable ? inputElement.textContent : inputElement.value;
    const morse = textToMorse(textToEncode);

    if (isContentEditable) {
      // Create a range to select all content
      const range = document.createRange();
      range.selectNodeContents(inputElement);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      // Use document.execCommand to replace the selected text
      document.execCommand('insertText', false, morse);

    } else if (inputElement.tagName === 'TEXTAREA' || inputElement.tagName === 'INPUT') {
      inputElement.value = morse;
    }
    removeExistingButton();
  });

  button.classList.add("morse-extension-btn");

  // Check if the input element has a parent with a relative position.
  let container = inputElement.parentElement;
  while (container && container.tagName !== 'BODY') {
    const style = window.getComputedStyle(container);
    if (style.position === 'relative' || style.position === 'absolute' || style.display === 'flex' || style.display === 'grid') {
      break;
    }
    container = container.parentElement;
  }
  
  if (container && container.tagName !== 'BODY') {
    container.appendChild(button);
  } else {
    // If no suitable parent is found, wrap the input element in a new div.
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    inputElement.parentNode.insertBefore(wrapper, inputElement);
    wrapper.appendChild(inputElement);
    wrapper.appendChild(button);
  }
}

// Function to remove the button
function removeExistingButton() {
  const existing = document.querySelector(".morse-extension-btn");
  if (existing) existing.remove();
}

// Event listener for when a user focuses on a textbox.
document.addEventListener("focusin", function(e) {
  const target = e.target;
  // Check for common text input fields, including contenteditable divs.
  if (target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT" || target.isContentEditable)) {
    showEncodeButton(target);
  }
});

// Use a MutationObserver to watch for new nodes being added to the DOM.
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      // Check if the added node is a potential input field
      if (node.tagName === "TEXTAREA" || node.tagName === "INPUT" || (node.isContentEditable && node.id === 'ymail_body')) {
        showEncodeButton(node);
      }
    });
  });
});

// Start observing the entire document body for changes in the DOM.
observer.observe(document.body, { childList: true, subtree: true });