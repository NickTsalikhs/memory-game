const symbols = ["🍎", "🍌", "🍇", "🍒", "🍋", "🍉"];

const board = document.querySelector("#board");
const movesDisplay = document.querySelector("#moves");
const statusDisplay = document.querySelector("#status");
const restartButton = document.querySelector("#restart");

const gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    isLocked: false,
    isGameOver: false
};

function shuffle(items) {
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

function createCards() {
    const pairs = [...symbols, ...symbols];

    return shuffle(pairs).map((symbol, index) => ({
        id: index,
        symbol,
        isMatched: false
    }));
}

function renderCards() {
    board.innerHTML = "";

    gameState.cards.forEach((card) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "card";
        button.textContent = "?";
        button.setAttribute("aria-label", "Hidden card");
        button.dataset.id = card.id;

        button.addEventListener("click", () => handleCardClick(card.id));

        board.appendChild(button);
    });
}

function updateMoves() {
    movesDisplay.textContent = gameState.moves;
}

function handleCardClick(id) {
    const card = gameState.cards[id];
    const button = board.querySelector(`[data-id="${id}"]`);

    if (gameState.isLocked || gameState.isGameOver) return;
    if (card.isMatched || gameState.flippedCards.includes(id)) return;

    button.textContent = card.symbol;
    button.classList.add("is-revealed");
    button.setAttribute("aria-label", card.symbol);
    gameState.flippedCards.push(id);

    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        updateMoves();
        checkMatch();
    }
}

function checkMatch() {
    const [firstId, secondId] = gameState.flippedCards;
    const first = gameState.cards[firstId];
    const second = gameState.cards[secondId];
    const firstBtn = board.querySelector(`[data-id="${firstId}"]`);
    const secondBtn = board.querySelector(`[data-id="${secondId}"]`);

    if (first.symbol === second.symbol) {
        first.isMatched = true;
        second.isMatched = true;
        firstBtn.classList.add("is-matched");
        secondBtn.classList.add("is-matched");
        gameState.matchedPairs++;
        gameState.flippedCards = [];
        statusDisplay.textContent = "Match!";

        if (gameState.matchedPairs === symbols.length) {
            gameState.isGameOver = true;
            statusDisplay.textContent = `You won in ${gameState.moves} moves!`;
        }
    } else {
        gameState.isLocked = true;
        statusDisplay.textContent = "Not a match, try again";

        setTimeout(() => {
            [firstBtn, secondBtn].forEach((btn) => {
                btn.textContent = "?";
                btn.classList.remove("is-revealed");
                btn.setAttribute("aria-label", "Hidden card");
            });
            gameState.flippedCards = [];
            gameState.isLocked = false;
        }, 800);
    }
}

function startGame() { 
    gameState.cards = createCards();
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.moves = 0;
    gameState.isLocked = false;
    gameState.isGameOver = false;

    updateMoves();
    statusDisplay.textContent = "Choose any card to begin";
    renderCards();
}

restartButton.addEventListener("click", startGame);

startGame();