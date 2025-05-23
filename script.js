let wordList = [];
let targetWord = '';
let currentAttempt = 0;
let currentGuess = '';
let gameOver = false;
let absentLetters = new Set();

//Fetched it from the url provided, using raw they were in the form of text using split with the line delimiter extracted the word list.
async function fetchWordList() {
    const response = await fetch('https://gist.githubusercontent.com/jacoby/19a30ff256ef7736a4f53e7ddc2c9474/raw/');
    const text = await response.text();
    return text.trim().split('\n').map(w => w.toUpperCase());
}

function pickRandomWord() {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

function updateBoard() {
    for (let i = 0; i < 4; i++) {
        const cell = document.getElementById(`cell-${currentAttempt}-${i}`);
        //To debug the cell selected.
        console.log(cell)
        if (cell) {
            cell.textContent = currentGuess[i] || '';
            console.log("the text content is", cell.textContent);
            cell.className = 'Cell border border-gray-400 w-[52px] h-[52px] flex items-center justify-center text-xl font-bold text-white';
        }
    }
}

function evaluateGuess() {
    let result = ['', '', '', ''];
    let letterCount = {};

    for (let letter of targetWord) {
        //If exists then use it else set it to zero used logical or operator to do it.
        if(letterCount[letter] === undefined) {
            letterCount[letter] = 0;
        }
        else {
            letterCount[letter]++;
        }
    }

    for (let i = 0; i < 4; i++) {
        if (currentGuess[i] === targetWord[i]) {
            result[i] = 'correct';
            letterCount[currentGuess[i]]--;
        }
    }

    //Checking for misplaced letters by using count that they are present but not at their position as their count has not decreased.
    for (let i = 0; i < 4; i++) {
        if (result[i]) continue;
        const letter = currentGuess[i];
        //If the current letter has count in target word that means it is present but not at the right place.
        if (letterCount[letter]) {
            result[i] = 'misplaced';
            letterCount[letter]--;
        } else {
            result[i] = 'absent';
        }
    }

    //assigned style based on each cells category.
    for (let i = 0; i < 4; i++) {
        const cell = document.getElementById(`cell-${currentAttempt}-${i}`);
        if (!cell) continue;
        cell.classList.remove('bg-green-500', 'bg-yellow-400', 'bg-gray-400');
        if (result[i] === 'correct') {
            cell.classList.add('bg-green-500', 'text-white');
        } else if (result[i] === 'misplaced') {
            cell.classList.add('bg-yellow-400', 'text-white');
        } else {
            cell.classList.add('bg-gray-400', 'text-white');
            absentLetters.add(currentGuess[i]);  //Tracking absent letters in this set.
            const keyBtn = document.getElementById(`key-${currentGuess[i]}`);
            if (keyBtn) {
                keyBtn.classList.remove('bg-gray-400');
                keyBtn.classList.add('bg-gray-700', 'text-white');
                keyBtn.disabled = true;  //removing the event listener of that key.
                keyBtn.style.cursor = 'not-allowed';
            }
        }
    }

    if (currentGuess === targetWord) {
        setTimeout(() => {
            alert('Correct! You win!');
            setTimeout(resetGame, 1000);
        }, 100);
        gameOver = true;
    } else if (currentAttempt === 4) {
        setTimeout(() => {
            alert(`Game over! The word was ${targetWord}`);
            setTimeout(resetGame, 1000);
        }, 100);
        gameOver = true;
    }

    currentAttempt++;
    currentGuess = '';
}

function handleKeyPress(key) {
    if (gameOver) return;
    if (absentLetters.has(key)) {
        return;  //ignoring this keypress as no listener is present.
    }
    console.log("Key pressed:", key);

    if (key === 'BACKSPACE') {
        if (currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
            const cell = document.getElementById(`cell-${currentAttempt}-${currentGuess.length}`);
            if (cell) cell.textContent = '';
        }
    } else if (key === 'ENTER') {
        if (currentGuess.length === 4) {
            if (!wordList.includes(currentGuess)) {
                alert(`${currentGuess} is not a valid word!`);
                return;
            }
            evaluateGuess();
        }
    } else if (/^[A-Z]$/.test(key)) {
        if (currentGuess.length < 4) {
            currentGuess += key;
            updateBoard();
        }
    }
    console.log("Current guess:", currentGuess);
}

function resetGame() {
    currentAttempt = 0;
    currentGuess = '';
    gameOver = false;
    absentLetters.clear(); //clearing the set of absent letters upon reset.

    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 4; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            if (cell) {
                cell.textContent = '';
                cell.className = 'Cell border border-gray-400 w-[52px] h-[52px] flex items-center justify-center text-xl font-bold';
            }
        }
    }

    //Reset all keyboard buttons to normal state which I disabled before.
    document.querySelectorAll('.Key').forEach(button => {
        button.disabled = false; 
        button.classList.remove('bg-gray-700', 'text-white');
        button.classList.add('bg-gray-400');
        button.style.cursor = 'pointer';
    });

    targetWord = pickRandomWord();
    console.log("Target word:", targetWord);
}


function setupKeyboard() {
    document.querySelectorAll('.Key').forEach(button => {
        button.addEventListener('click', () => {
            let key = button.textContent.trim();
            key = key === '⌫' ? 'BACKSPACE' : key.toUpperCase();
            handleKeyPress(key);
        });
    });
}

function setupPhysicalKeyboard() {
    document.addEventListener('keydown', e => {
        const key = e.key.toUpperCase();
        if (key === 'BACKSPACE' || key === 'ENTER' || /^[A-Z]$/.test(key)) {
            handleKeyPress(key);
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    wordList = await fetchWordList();
    console.log("Word list loaded:", wordList);
    setupKeyboard();
    setupPhysicalKeyboard();
    document.getElementById('restart-btn').addEventListener('click', resetGame);
    resetGame();
});
