// Impossible Wordle - Game Grid Generation
function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.id = `tile-${i}-${j}`;
            row.appendChild(tile);
        }
        
        gameBoard.appendChild(row);
    }
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ];
    
    rows.forEach(row => {
        const keyboardRow = document.createElement('div');
        keyboardRow.classList.add('keyboard-row');
        
        row.forEach(key => {
            const keyElement = document.createElement('button');
            keyElement.classList.add('key');
            keyElement.textContent = key;
            keyElement.id = `key-${key}`;
            
            if (key === 'ENTER' || key === 'BACKSPACE') {
                keyElement.classList.add('wide');
            }
            
            keyboardRow.appendChild(keyElement);
        });
        
        keyboard.appendChild(keyboardRow);
    });
}

// Game state
let currentRow = 0;
let currentCol = 0;
let gameOver = false;
let currentGuess = '';

// Word list (5-letter words)
const wordList = [
    'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
    'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE',
    'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE',
    'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ASIDE', 'ASSET', 'AVOID', 'AWAKE', 'AWARD',
    'AWARE', 'BADLY', 'BAKER', 'BASES', 'BASIC', 'BATCH', 'BEACH', 'BEGAN', 'BEGIN', 'BEING',
    'BELOW', 'BENCH', 'BILLY', 'BIRTH', 'BLACK', 'BLAME', 'BLANK', 'BLAST', 'BLIND', 'BLOCK',
    'BLOOD', 'BOARD', 'BOAST', 'BONUS', 'BOOST', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BRASS',
    'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD',
    'BUILT', 'BUYER', 'CABLE', 'CALIF', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHAOS',
    'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE',
    'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLICK', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOUD',
    'COACH', 'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRASH', 'CRAZY', 'CREAM',
    'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CURVE', 'CYCLE', 'DAILY', 'DANCE', 'DATED',
    'DEALT', 'DEATH', 'DEBUT', 'DELAY', 'DEPTH', 'DOING', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA',
    'DRANK', 'DRAWN', 'DREAM', 'DRESS', 'DRILL', 'DRINK', 'DRIVE', 'DROVE', 'DYING', 'EAGER',
    'EARLY', 'EARTH', 'EIGHT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL',
    'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIBER',
    'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLASH', 'FLEET', 'FLOOR',
    'FLUID', 'FOCUS', 'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK', 'FRAUD',
    'FRESH', 'FRONT', 'FRUIT', 'FULLY', 'FUNNY', 'GIANT', 'GIVEN', 'GLASS', 'GLOBE', 'GOING',
    'GRACE', 'GRADE', 'GRAND', 'GRANT', 'GRASS', 'GRAVE', 'GREAT', 'GREEN', 'GROSS', 'GROUP',
    'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'HAPPY', 'HARRY', 'HEART', 'HEAVY', 'HENCE',
    'HENRY', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'HURRY', 'IMAGE', 'INDEX', 'INNER', 'INPUT',
    'ISSUE', 'JAPAN', 'JIMMY', 'JOINT', 'JONES', 'JUDGE', 'KNOWN', 'LABEL', 'LARGE', 'LASER',
    'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEVEL', 'LEWIS',
    'LIGHT', 'LIMIT', 'LINKS', 'LIVES', 'LOCAL', 'LOGIC', 'LOOSE', 'LOWER', 'LUCKY', 'LUNCH',
    'LYING', 'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MARIA', 'MATCH', 'MAYBE', 'MAYOR', 'MEANT',
    'MEDIA', 'METAL', 'MIGHT', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MONEY', 'MONTH', 'MORAL',
    'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVED', 'MOVIE', 'MUSIC', 'NEEDS', 'NEVER', 'NEWLY',
    'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE', 'OCCUR', 'OCEAN', 'OFFER', 'OFTEN',
    'ORDER', 'OTHER', 'OUGHT', 'PAINT', 'PANEL', 'PAPER', 'PARTY', 'PEACE', 'PETER', 'PHASE',
    'PHONE', 'PHOTO', 'PIANO', 'PICKED', 'PIECE', 'PILOT', 'PITCH', 'PLACE', 'PLAIN', 'PLANE',
    'PLANT', 'PLATE', 'POINT', 'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE', 'Prime', 'PRINT',
    'PRIOR', 'PRIZE', 'PROOF', 'PROUD', 'PROVE', 'QUEEN', 'QUICK', 'QUIET', 'QUITE', 'RADIO',
    'RAISE', 'RANGE', 'RAPID', 'RATIO', 'REACH', 'READY', 'REALM', 'REBEL', 'REFER', 'RELAX',
    'REPAY', 'REPLY', 'RIGHT', 'RIGID', 'RIVAL', 'RIVER', 'ROBIN', 'ROGER', 'ROMAN', 'ROUGH',
    'ROUND', 'ROUTE', 'ROYAL', 'RURAL', 'SCALE', 'SCENE', 'SCOPE', 'SCORE', 'SENSE', 'SERVE',
    'SEVEN', 'SHALL', 'SHAPE', 'SHARE', 'SHARP', 'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHINE',
    'SHIRT', 'SHOCK', 'SHOOT', 'SHORT', 'SHOWN', 'SIGHT', 'SILLY', 'SINCE', 'SIXTH', 'SIXTY',
    'SIZED', 'SKILL', 'SLEEP', 'SLIDE', 'SMALL', 'SMART', 'SMILE', 'SMITH', 'SMOKE', 'SOLID',
    'SOLVE', 'SORRY', 'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPENT',
    'SPLIT', 'SPOKE', 'SPORT', 'STAFF', 'STAGE', 'STAKE', 'STAND', 'START', 'STATE', 'STEAM',
    'STEEL', 'STEEP', 'STEER', 'STEVE', 'STICK', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STORE',
    'STORM', 'STORY', 'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER',
    'SWEET', 'TABLE', 'TAKEN', 'TASTE', 'TAXES', 'TEACH', 'TEENS', 'TEETH', 'TERRY', 'TEXAS',
    'THANK', 'THEFT', 'THEIR', 'THEME', 'THERE', 'THESE', 'THICK', 'THING', 'THINK', 'THIRD',
    'THOSE', 'THREE', 'THREW', 'THROW', 'THUMB', 'TIGER', 'TIGHT', 'TIMES', 'TIRED', 'TITLE',
    'TODAY', 'TOPIC', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN', 'TREAT',
    'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED', 'TRIES', 'TRULY', 'TRUNK', 'TRUST', 'TRUTH',
    'TWICE', 'TWIST', 'TYLER', 'UNCLE', 'UNDER', 'UNDUE', 'UNION', 'UNITY', 'UNTIL', 'UPPER',
    'UPSET', 'URBAN', 'USAGE', 'USUAL', 'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL', 'VOCAL',
    'VOICE', 'WASTE', 'WATCH', 'WATER', 'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE',
    'WHOSE', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD', 'WRITE',
    'WRONG', 'WROTE', 'YIELD', 'YOUNG', 'YOURS', 'YOUTH'
];

// Select a random target word
let targetWord = wordList[Math.floor(Math.random() * wordList.length)];

function addKeyboardEventListeners() {
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', () => {
            handleKeyPress(key.textContent);
        });
    });
    
    document.addEventListener('keydown', (event) => {
        const key = event.key.toUpperCase();
        if (key === 'ENTER') {
            handleKeyPress('ENTER');
        } else if (key === 'BACKSPACE') {
            handleKeyPress('BACKSPACE');
        } else if (key.match(/^[A-Z]$/)) {
            handleKeyPress(key);
        }
    });
}

function handleKeyPress(key) {
    if (gameOver) return;
    
    if (key === 'ENTER') {
        if (currentCol === 5) {
            if (isValidWord(currentGuess)) {
                checkGuess();
            } else {
                showMessage('Not a valid word!');
            }
        } else {
            showMessage('Not enough letters!');
        }
    } else if (key === 'BACKSPACE') {
        if (currentCol > 0) {
            currentCol--;
            currentGuess = currentGuess.slice(0, -1);
            const tile = document.getElementById(`tile-${currentRow}-${currentCol}`);
            tile.textContent = '';
            tile.classList.remove('filled');
        }
    } else if (key.match(/^[A-Z]$/)) {
        if (currentCol < 5) {
            const tile = document.getElementById(`tile-${currentRow}-${currentCol}`);
            tile.textContent = key;
            tile.classList.add('filled');
            currentGuess += key;
            currentCol++;
        }
    }
}

function isValidWord(word) {
    return wordList.includes(word.toUpperCase());
}

function checkGuess() {
    const guess = currentGuess.toUpperCase();
    
    // Color the tiles
    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById(`tile-${currentRow}-${i}`);
        const letter = guess[i];
        
        if (letter === targetWord[i]) {
            tile.classList.add('correct');
            updateKeyboard(letter, 'correct');
        } else if (targetWord.includes(letter)) {
            tile.classList.add('present');
            updateKeyboard(letter, 'present');
        } else {
            tile.classList.add('absent');
            updateKeyboard(letter, 'absent');
        }
    }
    
    // Check if won
    if (guess === targetWord) {
        gameOver = true;
        showMessage('You won! (Wait, that shouldn\'t be possible...)');
    } else if (currentRow === 5) {
        gameOver = true;
        showMessage(`Game over! The word was ${targetWord}`);
    } else {
        currentRow++;
        currentCol = 0;
        currentGuess = '';
    }
}

function updateKeyboard(letter, status) {
    const keyElement = document.getElementById(`key-${letter}`);
    if (keyElement && !keyElement.classList.contains('correct')) {
        keyElement.classList.remove('present', 'absent');
        keyElement.classList.add(status);
    }
}

function showMessage(text) {
    document.getElementById('message').textContent = text;
    setTimeout(() => {
        document.getElementById('message').textContent = '';
    }, 3000);
}

// Initialize the game board and keyboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createGameBoard();
    createKeyboard();
    addKeyboardEventListeners();
    console.log(`Game loaded! Target word: ${targetWord}`);
});