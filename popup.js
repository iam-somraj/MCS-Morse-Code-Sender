function updatePowerButtonUI(isEnabled) {
    const powerButton = document.getElementById('powerButton');
    if (isEnabled) {
        powerButton.textContent = '|';
        powerButton.classList.add('on');
    } else {
        powerButton.textContent = 'O';
        powerButton.classList.remove('on');
    }
}

chrome.storage.local.get(['isEnButtonEnabled'], (result) => {
    let isEnabled = result.isEnButtonEnabled;

    if (isEnabled === undefined) {
        isEnabled = true;
        chrome.storage.local.set({ isEnButtonEnabled: true });
    }
    updatePowerButtonUI(isEnabled);
});

document.getElementById('powerButton').addEventListener('click', () => {
    chrome.storage.local.get(['isEnButtonEnabled'], (result) => {
        const newState = !result.isEnButtonEnabled;
        chrome.storage.local.set({ isEnButtonEnabled: newState }, () => {
            updatePowerButtonUI(newState);
            
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleEnButton', enabled: newState });
                }
            });
        });
    });
});

document.getElementById('encodeButton').addEventListener('click', () => {
    const textInput = document.getElementById('textInput').value;
    
    const morseResult = textToMorse(textInput + ' ');
    
    document.getElementById('morseResult').value = morseResult;
    document.getElementById('morseOutput').style.display = 'block';
});

document.getElementById('copyButton').addEventListener('click', () => {
    const morseResult = document.getElementById('morseResult');
    morseResult.select();
    document.execCommand('copy');
});
