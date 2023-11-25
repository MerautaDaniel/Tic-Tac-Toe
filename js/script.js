//DOM Elements
const cellsElements = document.querySelectorAll('[data-id="cell"]');
const modalElement = document.querySelector('[data-id="modal"]');
const modalWrapper = document.querySelector('[data-id="modal_wrapper"]');
const modalContentElement = modalElement.querySelector(".modal_content");
const spanElementFPlayer = document.querySelector(`[data-id="first_player-name"]`);
const spanElementSPlayer = document.querySelector(`[data-id="second_player-name"]`);
const spanXScore = document.querySelector(`[data-id="X-Score"]`);
const span0Score = document.querySelector(`[data-id="0-Score"]`);
const spanDrawScore = document.querySelector(`[data-id="draw"]`);
const quitBtnEl = document.querySelector(`[data-id="quit"]`);
const newRoundBtnEl = document.querySelector(`[data-id="new-round"]`);

const btnEl = document.getElementById("restart-btn");
const refreshModalEl = document.querySelector(`[data-id="refresh_modal"]`);
const cancelBtnEl = document.querySelector(`[data-id="cancel"]`);
const continueBtnEl = document.querySelector(`[data-id="continue"]`);

/*Get data from local storage */
const retrievedPlayers = localStorage.getItem("players");
const parsedPlayers = JSON.parse(retrievedPlayers);
/*Assigning to each player the right object retreved*/
let firstPlayer = getXPlayer();
let secondPlayer = getOPlayer();

const game = {
  currentPlayer: firstPlayer,
  isXTurn: true,
  XWins: 0,
  OWins: 0,
  ties: 0,
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

/*Event Listeners*/
btnEl.addEventListener("click", openRefreshModal);
cancelBtnEl.addEventListener("click", cancelGame);
continueBtnEl.addEventListener("click", continueGame);
quitBtnEl.addEventListener("click", quitCurrentGame);
newRoundBtnEl.addEventListener("click", newRound);

/*Start Game*/
startGame();

/*New Round*/
function newRound() {
  //remove the modal
  modalWrapper.classList.add("hidden");
  //reset game status
  cellsElements.forEach((cell) => {
    cell.removeAttribute("busy");
    cell.classList.remove("x_confirmed", "o_confirmed", "x_wins", "o_wins", "x", "o");
  });
  game.moves = [];
  modalContentElement.innerHTML = "";
  startGame();
}
/*Quit the game -> return to index.html*/
function quitCurrentGame() {
  window.location = "./index.html";
}
/*Open the modal to continue a game or to start a new one */
function openRefreshModal() {
  refreshModalEl.classList.remove("hidden");
}

/*Allow to start a new game canceling the previous game*/
function cancelGame() {
  console.log("The game will be canceled");
  refreshModalEl.classList.add("hidden");
  localStorage.removeItem("gameSaved");
  game.XWins = 0;
  game.OWins = 0;
  game.ties = 0;
  spanXScore.innerText = game.XWins;
  span0Score.innerText = game.OWins;
  spanDrawScore.innerText = game.ties;
}

function continueGame() {
  console.log("Game will continue");
  refreshModalEl.classList.add("hidden");
  console.log("New round is about to begin...");
  let game = getGame();
  //Populate the score board
  if (game) {
    spanXScore.innerText = game.XWins;
    span0Score.innerText = game.OWins;
    spanDrawScore.innerText = game.ties;
  } else {
    alert("No game was played");
  }
  console.log(game);
  newRound();
}
function startGame() {
  displayNameOnDom();
  cellsElements.forEach((cell) => {
    cell.addEventListener("click", handleClick, { once: true });
  });
  setHoverClass();
}

/* Cell click */
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
  saveGame();
  if (game.status.winner) {
    //highlight the winning pattern with the color of the winner
    addWinnerClass(game.status.winner);
    //updates the score in the DOM
    updateScore(game.status.winner);
    //display the modal with the winner
    displayModal(game.status.winner);

    saveGame();
    //then return
    return;
  }

  //check draw
  if (game.moves.length === 9 && game.status.status === "complete") {
    //Display the modal for a draw
    isDraw();
    saveGame();
  }

  //switch turn
  swapTurn();

  /*Set the indicator for the next player mark*/
  updateTurnIndicator();

  setHoverClass();
}

/* Display the name of the players */
function displayNameOnDom() {
  spanElementFPlayer.innerText = firstPlayer.playerName;
  spanElementSPlayer.innerText = secondPlayer.playerName;
}

/*Update the score on DOM*/
function updateScore(player) {
  if (player.value === "X") {
    game.XWins = game.XWins + 1;
  } else if (player.value === "0") {
    game.OWins = game.OWins + 1;
  } else {
    game.ties = game.ties + 1;
  }
  spanXScore.innerText = game.XWins;
  span0Score.innerText = game.OWins;
  spanDrawScore.innerText = game.ties;
}

/*Display the modal for a Draw game*/
function isDraw() {
  modalWrapper.classList.remove("hidden");
  const title = document.createElement("h2");
  title.textContent = "Round tied";
  modalContentElement.appendChild(title);
  title.classList.add("modal_title");

  game.ties++;
  spanDrawScore.innerText = game.ties;
}

/*Place the correct mark on the clicked cell*/
/* Set an busy attribute on the cell*/
function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.setAttribute("busy", true);
}

/*Set up game moves*/
function updateGameMoves(cell, player) {
  return game.moves.push({ cell, player });
}

/* Get the player moves */
function getPlayerMoves(moves, player) {
  return moves.filter((move) => move.player === player.value).map((move) => +move.cell);
}

/* Get the winning pattern */
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

/* Get the status of the game and the winner if any */
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

/* Apply a class to the cells corresponding to the winning pattern */
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

/*Display the modal for winning state with the coresponding message*/
function displayModal(player) {
  //Show the modal
  modalWrapper.classList.remove("hidden");
  let winnerName = player.playerName;
  let winnerIcon = player.value;
  const paragraph = document.createElement("p");
  const title = document.createElement("h2");
  const span = document.createElement("span");
  const mark = document.createElement("img");

  if (player) {
    mark.setAttribute("width", "24px");
    mark.setAttribute("height", "24px");
    mark.setAttribute("alt", "Player Icon");
    title.textContent = "Takes the round";

    paragraph.innerHTML = `${winnerName} wins!`;
    paragraph.classList.add("modal_player-name");

    modalContentElement.appendChild(paragraph);
    modalContentElement.appendChild(title);
    title.prepend(span);
    span.classList.add("modal_player-icon");
    span.appendChild(mark);
    if (winnerIcon === "X") {
      mark.setAttribute("src", "./assets/icon-x.svg");
      title.classList.add("modal_title", "modal_title__player-X-color");
    }
    if (winnerIcon === "0") {
      mark.setAttribute("src", "./assets/icon-o.svg");
      title.classList.add("modal_title", "modal_title__player-0-color");
    }
  }
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

/* Get the players from Local Storage*/
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

/* Save the game to local storage */
function saveGame() {
  localStorage.setItem("gameSaved", JSON.stringify(game));
}

function getGame() {
  return JSON.parse(localStorage.getItem("gameSaved"));
}
