let wordList = [];

async function fetchWordList() {
  const response = await fetch('https://gist.githubusercontent.com/jacoby/19a30ff256ef7736a4f53e7ddc2c9474/raw/');
  const data = await response.text();

  return data.split('\n').map(word => word.trim()).filter(word => word.length > 0);
}

function startGame() {
    fetchWordList().then(words => {
    wordList = words;
    const targetWord = pickRandomWord();
    const maxAttempts = 6;
    let currentAttempt = 0;
    let currentGuess = '';
    let gameOver = false;
});

}

function handleKeyPress(event) {
    // Handle keyboard input (letters, enter, backspace)
}

function submitGuess() {
    // Check the current guess against the target word
}

function updateBoard() {
    // Update the UI to reflect the current guesses
}

function showError(message) {
    // Display error messages to the user
}

function pickRandomWord() {
    // Select a random word from the word list
}

function handleBackspace() {
    // Handle backspace/delete key logic
}

function endGame(win) {
    // Handle end of game (win or lose)
}
function resetGame() {
    // Reset the game state and UI for a new game
    
}