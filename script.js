//constants

const activePlayerClass = 'player--active';

//selectors

const dice = document.querySelector('.dice');

const newBtn = document.querySelector('.btn--new');
const rollBtn = document.querySelector('.btn--roll');
const holdBtn = document.querySelector('.btn--hold');

//

const gameStates = {
  playing: 'GAMESTATE_PLAYING',
  done: 'GAMESTATE_DONE',
};

let gameState;

//

const playerIds = ['player--0', 'player--1'];

//retuns a player from input id
function getPlayer(id) {
  const player = document.querySelector(`.${id}`);

  return {
    selector: player,
    score: player.children[1],
    currentScore: player.children[2].children[1],
  };
}

//returns current active player
function getActivePlayerId() {
  return document.querySelector(`.${activePlayerClass}`).classList[1];
}

//returns a score value from player id
function getPlayerScore(id) {
  return Number.parseInt(getPlayer(id).score.textContent);
}

//returns a current score from player id
function getPlayerCurrent(id) {
  return Number.parseInt(getPlayer(id).currentScore.textContent);
}

//returns player current + global score's sum
function getPlayerSum(id) {
  return Number.parseInt(getPlayerCurrent(id) + getPlayerScore(id));
}

//sets a player's score from id to new input value
function setPlayerScore(id, newValue) {
  getPlayer(id).score.textContent = newValue;
}

//sets a player's curerent score from id to new input value
function setPlayerCurrent(id, newValue) {
  getPlayer(id).currentScore.textContent = newValue;
}

//

function generateRandomNumber(max) {
  return Math.floor(Math.random() * max) + 1;
}

function endScreen(winner) {
  //show winner screen
  console.log(`${winner} has won the game !`);

  //set bg-colors

  const players = document.querySelectorAll('player');

  playerIds.forEach(playerId => {
    const player = getPlayer(playerId);

    if (player.selector.classList.contains(winner)) {
      player.selector.classList.add('winner');
      player.selector.classList.remove('loser');
    } else {
      player.selector.classList.add('loser');
      player.selector.classList.remove('winner');
    }
  });
}

//

const dice_roll = [
  {
    transform: 'rotate(360deg)',
  },
  {
    transform: 'rotate(0)',
  },
];

//

function rollDice() {
  //animate dice
  dice.animate(dice_roll, 360);

  //check game state
  if (gameState === gameStates.done) {
    return;
  }
  //roll dice
  let randomNum = generateRandomNumber(6);
  dice.src = `./assets/dice/dice-${randomNum}.png`;

  const activePlayerId = getActivePlayerId();
  console.log(activePlayerId);
  //game checks

  if (randomNum === 1) {
    //set player's current value to 0 (not adding to player's global score)
    setPlayerCurrent(activePlayerId, 0);
    //swap players
    swapPlayers();
    return;
  }

  //add to player's current score
  setPlayerCurrent(
    activePlayerId,
    getPlayerCurrent(activePlayerId) + randomNum
  );

  if (getPlayerSum(activePlayerId) >= 100) {
    //end game, active player has won the game !
    end();
    return;
  }
}

function swapPlayers() {
  const activePlayerId = getActivePlayerId();

  if (activePlayerId === 'player--0') {
    getPlayer(activePlayerId).selector.classList.remove(activePlayerClass);
    getPlayer('player--1').selector.classList.add(activePlayerClass);
    return;
  }
  if (activePlayerId === 'player--1') {
    getPlayer(activePlayerId).selector.classList.remove(activePlayerClass);
    getPlayer('player--0').selector.classList.add(activePlayerClass);
    return;
  }
}

function onPlayerHold() {
  if (gameState === gameStates.done) {
    return;
  }

  const activePlayerId = getActivePlayerId();

  const playerScore = getPlayerScore(activePlayerId);
  const playerCurrent = getPlayerCurrent(activePlayerId);

  setPlayerScore(activePlayerId, playerScore + playerCurrent);
  setPlayerCurrent(activePlayerId, 0);

  swapPlayers();
}

//

function start() {
  //set state to playing
  gameState = gameStates.playing;
}

function restart() {
  //reset game
  reset();
  start();
}

function reset() {
  playerIds.forEach(id => {
    const player = getPlayer(id);

    //reset player's scores
    setPlayerScore(id, 0);
    setPlayerCurrent(id, 0);

    player.selector.classList.remove('loser');
    player.selector.classList.remove('winner');
  });
}

function end() {
  gameState = gameStates.done;
  endScreen(getActivePlayerId());
}

//event listeners

rollBtn.addEventListener('click', rollDice);
holdBtn.addEventListener('click', onPlayerHold);
newBtn.addEventListener('click', restart);

//init game
start();
