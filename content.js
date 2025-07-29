let isEnButtonEnabled = true;

function controlEnButtonVisibility(isEnabled, inputElement) {
  removeExistingButton(); 

  if (isEnabled && inputElement) {

    showEncodeButtonElement(inputElement);
  }
}

function showEncodeButtonElement(inputElement) {
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
    const isContentEditable = inputElement.isContentEditable;
    const textToEncode = isContentEditable ? inputElement.textContent : inputElement.value;
    const morse = textToMorse(textToEncode);

    if (isContentEditable) {
        inputElement.textContent = '';
    } else {
        inputElement.value = '';
    }

    const chars = morse.split('');
    let index = 0;
    const typeNextChar = () => {
        if (index < chars.length) {
            const char = chars[index];
            if (isContentEditable) {
                
                inputElement.textContent += char;
            } else {
               
                inputElement.value += char;
            }

            const event = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(event);

            index++;
            setTimeout(typeNextChar, 10);
        } else {
            removeExistingButton();
        }
    };
    typeNextChar();
  });

  button.classList.add("morse-extension-btn");

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
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    inputElement.parentNode.insertBefore(wrapper, inputElement);
    wrapper.appendChild(inputElement);
    wrapper.appendChild(button);
  }
}

function removeExistingButton() {
  const existing = document.querySelector(".morse-extension-btn");
  if (existing) existing.remove();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleEnButton') {
    isEnButtonEnabled = request.enabled;
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT" || activeElement.isContentEditable)) {
        controlEnButtonVisibility(isEnButtonEnabled, activeElement);
    } else {
        removeExistingButton();
    }
  }
});

chrome.storage.local.get(['isEnButtonEnabled'], (result) => {
    if (result.isEnButtonEnabled !== undefined) {
        isEnButtonEnabled = result.isEnButtonEnabled;
    }

});

document.addEventListener("focusin", function(e) {
  const target = e.target;
  if (target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT" || target.isContentEditable)) {
    controlEnButtonVisibility(isEnButtonEnabled, target);
  } else {
    removeExistingButton();
  }
});

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1 && (node.tagName === "TEXTAREA" || node.tagName === "INPUT" || node.isContentEditable)) {
        if (isEnButtonEnabled) {
          if (document.activeElement === node || node.contains(document.activeElement)) {
             controlEnButtonVisibility(isEnButtonEnabled, document.activeElement);
          }
        }
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });
