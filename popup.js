document.getElementById('encodeButton').addEventListener('click', () => {
    const textInput = document.getElementById('textInput').value;
    // Add a space to the end of the text to ensure the last character is encoded correctly
    const morseResult = textToMorse(textInput + ' ');
    
    document.getElementById('morseResult').value = morseResult;
    document.getElementById('morseOutput').style.display = 'block';
});

document.getElementById('copyButton').addEventListener('click', () => {
    const morseResult = document.getElementById('morseResult');
    morseResult.select();
    document.execCommand('copy');
});