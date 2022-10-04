const gameStart = (() => {

    // Players factory function
    const player = (marker) => {

        // Get player's marker
        function getMarker() {
            return marker;
        };

        return { getMarker, }
    };

    // gameBoard IIFE
    const gameBoard = (() => {
        
        // Empty board
        let board = [
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        ];

        // Set a marker
        function setBoard(index, marker) {
            if(marker === gameFlow.playerX.getMarker()) {
                board[index]++
            } else if(marker === gameFlow.playerO.getMarker()) {
                board[index]--
            }
        };

        // Reset game board
        function resetBoard() {
            for(let i = 0; i < board.length; i++) {
                board[i] = 0;
            }
            return board;
        };

        return {
            board,
            setBoard,
            resetBoard,
        };
    })();

    // Game flow IIFE
    const gameFlow = (() => {

        // Create two players
        const playerX = player("X");
        const playerO = player("O");

        const winConditions = (() => {
            // Win conditions
            let combos = [
                [gameBoard.board[0], gameBoard.board[1], gameBoard.board[2]],
                [gameBoard.board[3], gameBoard.board[4], gameBoard.board[5]],
                [gameBoard.board[6], gameBoard.board[7], gameBoard.board[8]],
                [gameBoard.board[0], gameBoard.board[3], gameBoard.board[6]],
                [gameBoard.board[1], gameBoard.board[4], gameBoard.board[7]],
                [gameBoard.board[2], gameBoard.board[5], gameBoard.board[8]],
                [gameBoard.board[0], gameBoard.board[4], gameBoard.board[8]],
                [gameBoard.board[2], gameBoard.board[4], gameBoard.board[6]]
            ];

            // updateCombos allows to take the updated game board values every turn
            function updateCombos(newBoard) {
                combos = [
                    [newBoard[0], newBoard[1], newBoard[2]],
                    [newBoard[3], newBoard[4], newBoard[5]],
                    [newBoard[6], newBoard[7], newBoard[8]],
                    [newBoard[0], newBoard[3], newBoard[6]],
                    [newBoard[1], newBoard[4], newBoard[7]],
                    [newBoard[2], newBoard[5], newBoard[8]],
                    [newBoard[0], newBoard[4], newBoard[8]],
                    [newBoard[2], newBoard[4], newBoard[6]]
                ];
                return combos;
            };

            return { updateCombos, }
        })();

        // Swap turn
        const currentMarker = (() => {
            let playerTurn = playerX.getMarker();
            function getPlayer() {
                return playerTurn;
            };

            function resetPlayer() {
                playerTurn = playerX.getMarker();
                return playerTurn;
            };

            function swapPlayer() {
                if(playerTurn === playerX.getMarker()) {
                    playerTurn = playerO.getMarker();
                } else {
                    playerTurn = playerX.getMarker();
                };
                return playerTurn;
            };

            return {
                getPlayer,
                swapPlayer,
                resetPlayer,
            }
        })();
        
        return { 
            playerX,
            playerO,
            currentMarker,
            winConditions,
        }
    })();

    // Display elements and Event listeners
    const displayController = (() => {
        const cells = document.querySelectorAll("[data-cell]");
        let round = 0;

        console.log("X makes the first move!")

        // For each cell run the private function _cellOnClick one time
        cells.forEach((cell) => {
            cell.addEventListener("click", _cellOnClick, { once: true });
        });

        function _cellOnClick(e) {
            // Set board with index cell id and current marker from gameFlow
            gameBoard.setBoard(e.target.id, gameFlow.currentMarker.getPlayer());

            // Add mark to the cell visually
            e.target.innerText = gameFlow.currentMarker.getPlayer();

            // Game flow functions
            gameFlow.currentMarker.swapPlayer();
            round++
            let updatedBoard = gameBoard.board;
            let updatedCombos = gameFlow.winConditions.updateCombos(updatedBoard);
            console.log(`Round: ${round}`)
            isWin(updatedCombos);
        }; 

        // Check if we have a winner or it's a draw
        function isWin(combos) {
            // Check if some of the arrays in combos have a sum of 3 or -3 (same marker in a win condition)
            let result = combos.some((arr) => {
                let sum = 0;
                for(let i = 0; i < arr.length; i++) {
                    sum += arr[i];
                }
                return sum === 3 || sum === -3;
            })

            // Console log the result (POSSIBLE CHANGE: MODAL)
            if(result === false && round === 9) {
                console.log("IT'S A DRAW!")
                cells.forEach((cell) => {
                    // Remove event listener from cell, the game will stop
                    cell.removeEventListener("click", _cellOnClick);
                });
            } else if(result) {
                console.log("WE HAVE A WINNER!")
                cells.forEach((cell) => {
                    cell.removeEventListener("click", _cellOnClick);
                });
            }
        };

        const restartBtn = document.querySelector(".restart");
        restartBtn.addEventListener("click", reset)
    
        function reset() {
            // Set the current player to x
            gameFlow.currentMarker.resetPlayer();
            // Reset round
            round = 0;
            // Reset board and win condition arrays
            let resetBoard = gameBoard.resetBoard();
            gameFlow.winConditions.updateCombos(resetBoard);
            // Add again the _cellOnClick event (removed by the win/draw)
            const cells = document.querySelectorAll("[data-cell]");
            cells.forEach((cell) => {
                cell.innerText = "";
                cell.addEventListener("click", _cellOnClick, { once: true });
            })
        }
    })();
})();