const players = [
  {
    playerName: "player 1",
    value: null,
    moves: true,
  },
  {
    playerName: "player 2",
    value: null,
    moves: false,
  },
];
//DOM variables
const xBtnEl = document.getElementById("x_btn");
const oBtnEl = document.getElementById("o_btn");
const vsCpuEl = document.getElementById("vsCPU");
const vsPlayerEl = document.getElementById("vsPlayer");

//Set initial status
//Only X button will be available for the player to click
oBtnEl.disabled = true;
vsCpuEl.disabled = true;
vsPlayerEl.disabled = true;

//Event listeners
xBtnEl.addEventListener("click", () => {
  //set the player
  players[0].value = "X";
  players[1].value = "0";
  console.log(players);
  //enable the game type
  vsPlayerEl.disabled = false;
});

vsPlayerEl.addEventListener("click", () => {
  //save the players to local storage
  localStorage.setItem("players", JSON.stringify(players));
  //go to the game-board page
  window.location = "./game-board.html";
});
