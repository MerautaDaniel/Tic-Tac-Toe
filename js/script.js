//DOM Elements
const cellsElements = document.querySelectorAll('[data-id="cell"]');

/*Get data from local storage */
const retrievedPlayers = localStorage.getItem("players");
const parsedPlayers = JSON.parse(retrievedPlayers);
/*Assigning to each player the right object retreved*/
let firstPlayer = getXPlayer();
let secondPlayer = getOPlayer();

const game = {
  currentPlayer: firstPlayer,
  isXTurn: true, //true | false
  moves: [],
  winning_combinations: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ],
};

startGame();

function startGame() {
  cellsElements.forEach((cell) => {
    cell.addEventListener("click", handleClick, { once: true });
  });
  setHoverClass();
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = game.isXTurn ? "x_confirmed" : "o_confirmed";
  game.currentPlayer = game.isXTurn ? firstPlayer : secondPlayer;

  //placeMark and set a busy attribute
  placeMark(cell, currentClass);

  //push to the array of moves the object {cell.id , player}
  updateGameMoves(cell.id, game.currentPlayer.value);

  //check for win
  const firstPlayerMoves = getPlayerMoves(game.moves, firstPlayer);
  const secondPlayerMoves = getPlayerMoves(game.moves, secondPlayer);
  game.status = getGameStatus(
    game.moves,
    game.winning_combinations,
    firstPlayerMoves,
    secondPlayerMoves
  );

  game.winning_pattern = getWinningPatern(
    game.winning_combinations,
    firstPlayerMoves,
    secondPlayerMoves
  );

  if (game.status.winner) {
    console.log(`The winner is: ${game.status.winner.value}`);
    addWinnerClass(game.status.winner);
    //display the modal with the winner

    //update the score board

    //then return
    return;
  }
  //check draw
  if (game.moves.length === 9 && game.status.status === "complete") {
    //Display the modal for a draw
    console.log("is a draw");
  }

  //switch turn
  swapTurn();

  /*Set the indicator for the next player mark*/
  updateTurnIndicator();

  setHoverClass();
}

/*Place the correct mark on the clicked cell*/
/* Set an busy attribute on the cell*/
function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.setAttribute("busy", true);
}

function updateGameMoves(cell, player) {
  return game.moves.push({ cell, player });
}

// Get the player moves
function getPlayerMoves(moves, player) {
  return moves
    .filter((move) => move.player === player.value)
    .map((move) => +move.cell);
}

//Get the winning pattern
function getWinningPatern(combinations, p1Moves, p2Moves) {
  for (let i = 0; i < combinations.length; i++) {
    const winn_pat = combinations[i];
    if (
      winn_pat.every((position) => p1Moves.includes(position)) ||
      winn_pat.every((position) => p2Moves.includes(position))
    ) {
      return winn_pat;
    }
  }
  return null;
}

// get the status of the game and the winner if any
function getGameStatus(moves, win_comb, p1Moves, p2Moves) {
  let winner = null;
  win_comb.forEach((comb) => {
    const firstPlayerWins = comb.every((value) => p1Moves.includes(value));
    const secondPlayerWins = comb.every((value) => p2Moves.includes(value));
    if (firstPlayerWins) winner = firstPlayer;
    if (secondPlayerWins) winner = secondPlayer;
  });

  return {
    status: moves.length === 9 || winner != null ? "complete" : "in_progress",
    winner,
  };
}

//Apply a class to the cells corresponding to the winning pattern
function addWinnerClass(player) {
  if (game.winning_pattern) {
    game.winning_pattern.forEach((element) => {
      let box = document.getElementById(`${element}`);
      if (player.value === "X") {
        box.classList.add("x_wins");
      }
      if (player.value === "0") {
        box.classList.add("o_wins");
      }
    });
  }
}

/*Swap players*/
function swapTurn() {
  game.isXTurn = !game.isXTurn;
}
/*Set the hover class if the cell do not have a busy attribute*/
function setHoverClass() {
  cellsElements.forEach((cell) => {
    cell.classList.remove("x");
    cell.classList.remove("o");
    if (cell.hasAttribute("busy")) return;

    if (game.isXTurn) {
      cell.classList.add("x");
    } else {
      cell.classList.add("o");
    }
  });
}

/*Update the Turn icon on the turn indicator element*/
function updateTurnIndicator() {
  const icon = document.querySelector("#icon");
  if (game.isXTurn) {
    icon.innerHTML = `<img src="./assets/icon-x.svg" alt="X">`;
  } else {
    icon.innerHTML = `<img src="./assets/icon-o.svg" alt="0">`;
  }
}

function getXPlayer() {
  let player;
  parsedPlayers.forEach((obj) => {
    if (obj.value === "X") {
      player = obj;
    }
  });
  return player;
}

function getOPlayer() {
  let player;
  parsedPlayers.forEach((obj) => {
    if (obj.value === "0") {
      player = obj;
    }
  });
  return player;
}
