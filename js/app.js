const players = [
  {
    playerName: "playerOne",
    value: null,
    moves: false,
  },
  {
    playerName: "playerTwo",
    value: null,
    moves: false,
  },
];

const actionButtons = document.querySelectorAll(".action-btn");
const buttons = document.querySelectorAll(".choice");
buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (button.value === "X") {
      players[0].value = button.value;
      players[0].moves = true;
      players[1].value = "0";
      localStorage.setItem("players", JSON.stringify(players));
      disableButtons();
      return;
    }
    if (button.value === "0") {
      players[0].value = button.value;
      players[1].value = "X";
      players[1].moves = true;
      localStorage.setItem("players", JSON.stringify(players));
      disableButtons();
      return;
    }
  });
});

function disableButtons() {
  buttons.forEach((button) => {
    button.disabled = true;
  });
}

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    localStorage.setItem("players", JSON.stringify(players));
    window.location = "./game-board.html";
  });
});
