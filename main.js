
    // DOM Elements
    const cells = document.querySelectorAll("[data-cell]");
    const restartBtn = document.querySelector(".restart");

// player factory function to create multiple players
const player = (marker) => {
    const getMarker = () => marker;
    return { getMarker };
};

const board = (() => {
    // Create the empty game board
    const gameBoard = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    // Set marker to a specific index
    function setBoardCell(index, marker) {
        gameBoard[index] = marker
    };

    // Get market at index...
    function getBoardCell(index) {
        gameBoard[index];
    }

})();

    const player1 = player("X");
    const player2 = player("O");

    let combos = [
        [gameBoard[0], gameBoard[1], gameBoard[2]],
        [gameBoard[3], gameBoard[4], gameBoard[5]],
        [gameBoard[6], gameBoard[7], gameBoard[8]],
        [gameBoard[0], gameBoard[3], gameBoard[6]],
        [gameBoard[1], gameBoard[4], gameBoard[7]],
        [gameBoard[2], gameBoard[5], gameBoard[8]],
        [gameBoard[0], gameBoard[4], gameBoard[8]],
        [gameBoard[2], gameBoard[4], gameBoard[6]]
    ];

    let round = 0;

    function updateCheckWinner() {
        combos = [
            [gameBoard[0], gameBoard[1], gameBoard[2]],
            [gameBoard[3], gameBoard[4], gameBoard[5]],
            [gameBoard[6], gameBoard[7], gameBoard[8]],
            [gameBoard[0], gameBoard[3], gameBoard[6]],
            [gameBoard[1], gameBoard[4], gameBoard[7]],
            [gameBoard[2], gameBoard[5], gameBoard[8]],
            [gameBoard[0], gameBoard[4], gameBoard[8]],
            [gameBoard[2], gameBoard[4], gameBoard[6]]
        ];
        return combos
    };

    // Player 1 starts
    let currentPlayer = player1.getMarker();

    // Swap turn function
    function swapTurn() {
        if(currentPlayer === player1.getMarker()) {
            currentPlayer = player2.getMarker();
        } else {
            currentPlayer = player1.getMarker();
        };
    };

    cells.forEach((cell) => {
        cell.addEventListener("click", cellOnClick, { once: true });
    });

    function cellOnClick(e) {
        const cellIndex = e.target.id;
        setBoardCell(cellIndex, currentPlayer);
        e.target.innerText = currentPlayer;
        swapTurn();
        updateCheckWinner();
        checkForWinners();
        round++;
        isDraw();
    };


    function checkForWinners() {
        const result = combos.some((arr) => {
            if(arr[0] === arr[1] && arr[1] === arr[2] && arr[1] !== "") {
            return isWin();
            };
        });
    return result;
    };

    function isWin() {
        console.log("WE HAVE A WINNER!");
    };

    function isDraw() {
        if(round === 9 && !isWin()) {
            console.log("IT'S A DRAW!")
        };
    };

    function reset() {
        for(let i = 0; i < gameBoard.length; i++) {
            gameBoard[i] = "";
        };

        cells.forEach((cell) => {
            cell.innerText = "";
        });

        updateCheckWinner();

        currentPlayer = player1.getMarker();

        round = 0;

        gameStart();

    };