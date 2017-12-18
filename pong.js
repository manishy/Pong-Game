const isMouseInRange = function(maxRange, minRange, newCoordinate) {
  return (newCoordinate > minRange) && (newCoordinate < maxRange);
};

const isLessThanMaxRange = function(position, maxRange) {
  return position < maxRange;
};

const isGreaterThanMinRange = function(position, minRange) {
  return position > minRange;
};

const isGreaterThanMaxCoord = function(currentPos, maxPos) {
  return currentPos > maxPos;
};

const isLessThanMinCoord = function(currentPos, minPos) {
  return currentPos < minPos;
};

const hasCrossedPaddle = function(ballTopPos,paddleTopPos) {
  return ballTopPos>paddleTopPos;
};


//----------------------MODEL---------------------------
//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------




const Paddle = function(initialPosition) {
  this.initialPosition = initialPosition;
  this.currentPosition = this.initialPosition[0];
};

Paddle.prototype = {
  getIncreasedXCoordinate: function(pixelsToMove, maxRange) {
    if (isLessThanMaxRange(this.currentPosition, maxRange)) {
      this.currentPosition += pixelsToMove;
    }
    return this.currentPosition;
  },

  getDecreasedXCoordinate: function(pixelsToMove, minRange) {
    if (isGreaterThanMinRange(this.currentPosition, minRange)) {
      this.currentPosition -= pixelsToMove;
    }
    return this.currentPosition;
  },

  getXCoordinateOnMouseMove: function(mouseCurrentPos, paddleWidth) {
    mouseCurrentPos -= 1.5 * paddleWidth;
    return mouseCurrentPos;
  }
};


const Ball = function(initialPosition, speed) {
  this.initialPosition = initialPosition;
  this.moveThroughX = speed;
  this.moveThroughY = speed;
};


Ball.prototype = {
  setPosition: function(currentPosition, maxCoordinates, minCoordinates) {
    let maxXcoordinate = maxCoordinates[0];
    let maxYcoordinate = maxCoordinates[1];
    let minXcoordinate = minCoordinates[0];
    let minYcoordinate = minCoordinates[1];
    if (isGreaterThanMaxCoord(currentPosition[0], maxXcoordinate)) {
      this.moveThroughX = -this.moveThroughX;
    }
    if (isLessThanMinCoord(currentPosition[0], minXcoordinate)) {
      this.moveThroughX = -this.moveThroughX;
    }
    if (isGreaterThanMaxCoord(currentPosition[1], maxYcoordinate)) {
      this.moveThroughY = -this.moveThroughY;
    }
    if (isLessThanMinCoord(currentPosition[1], minYcoordinate)) {
      this.moveThroughY = -this.moveThroughY;
    }
  },

  getNewCoordinates: function(maxCoordinates, minCoordinates) {
    let currentPosition = this.initialPosition;
    currentPosition[0] += this.moveThroughX;
    currentPosition[1] += this.moveThroughY;
    this.setPosition(currentPosition, maxCoordinates, minCoordinates);
    return currentPosition;
  }
};


const Game = function(ballInitialPos, paddleInitialPos, speed) {
  this.speed = speed;
  this.ball = new Ball(ballInitialPos, this.speed);
  this.paddle = new Paddle(paddleInitialPos);
  this.score = 0;
};

Game.prototype = {
  getIncreasedXCoordinate: function(pixelsToMove, maxRange) {
    return this.paddle.getIncreasedXCoordinate(pixelsToMove, maxRange);
  },

  getDecreasedXCoordinate: function(pixelsToMove, minRange) {
    return this.paddle.getDecreasedXCoordinate(pixelsToMove, minRange);
  },

  getXCoordinateOnMouseMove: function(mouseCurrentPos, paddleWidth) {
    return this.paddle.getXCoordinateOnMouseMove(mouseCurrentPos, paddleWidth);
  },

  getBallNewCoordinates: function(maxCoordinates, minCoordinates) {
    return this.ball.getNewCoordinates(maxCoordinates, minCoordinates);
  }
};




//----------------------CONTROLLER----------------------
//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------




let game = new Game([520, 300], [420, 400], 1);


//----------------------BALLCONTROLLER----------------------


let intervals = [];

const stop = function() {
  intervals.forEach(clearInterval);
};


const addClickListenerOnButtons = function() {
  let startButton = document.getElementById("startButton");
  let stopButton = document.getElementById("stopButton");
  startButton.onclick = startMove;
  stopButton.onclick = stop;
};

const startMove = function() {
  let interval = setInterval(setBallPosition, 1);
  intervals.push(interval);
  addKeyPressEvent();
  addMouseMoveEvent();
};


//----------------------PADDLECONTROLLER----------------------

const movePaddleOnClick = function(event) {
  let paddleId = document.getElementById("paddleField");
  if (event.keyCode == 39) {
    setPaddleDecreasedPosition(paddleId);
  }
  if (event.keyCode == 37) {
    setPaddleIncreasedPosition(paddleId);
  }
};


const movePaddleOnMouseMove = function() {
  let paddleId = document.getElementById("paddleField");
  let mouseCurrentPos = event.clientX;
  setPaddlePosOnMouseMove(mouseCurrentPos, paddleId);
};

const addMouseMoveEvent = function() {
  let fieldId = document.getElementById("field");
  fieldId.onmousemove = movePaddleOnMouseMove;
};

const addKeyPressEvent = function() {
  document.onkeydown = movePaddleOnClick;
};

//-----------------------GAMECONTROLLER-----------------

const checkForFinish = function(ballId) {
  let paddleId = document.getElementById("paddleField");
  let ballTopPos = ballId.offsetTop - 20;
  let paddleTopPos = paddleId.offsetTop-30;
  if (hasCrossedPaddle(ballTopPos,paddleTopPos))
    stopGame();
}

const addScore = function(ballId) {
  let paddleId = document.getElementById("paddleField");
  let scoreId = document.getElementById("score");
  if (isBallInPaddleRange(ballId, paddleId)) {
    game.ball.moveThroughY = -game.ball.moveThroughY;
    scoreId.innerText = `score: ${game.score+=5}`;
  }
};

const stopGame = function() {
  stop();
  finishGame();
};

const restart = function() {
  document.getElementById("startButton").disabled = false;
  let messageField = document.getElementById("looseMessage");
  messageField.style.visibility = "hidden";
  document.getElementById("score").innerText = "score: 0";
  let button = document.getElementById("restart");
  button.style.visibility = "hidden";
  game.ball.initialPosition = [520, 300];
  game.score = 0;
  startMove();
}

const addRestartButton = function() {
  let button = document.getElementById("restart");
  button.style.visibility = "visible";
  button.innerHTML = "<br><button>Restart ??</button>";
  button.addEventListener("click", restart);
}


const finishGame = function() {
  let messageField = document.getElementById("looseMessage");
  messageField.innerText = "Game Over !!\n Your score is " + `${game.score}`;
  messageField.style.visibility = "visible";
  addRestartButton();
  document.onkeydown = "";
  document.getElementById("field").onmousemove = "";
  document.getElementById("startButton").disabled = true;
}


const isBallInPaddleRange = function(ballId, paddleId) {
  let ballLeftPos = ballId.offsetLeft - 150;
  let ballTopPos = ballId.offsetTop - 20;
  let paddleLeftPos = paddleId.offsetLeft;
  return ballTopPos == 540 && ballLeftPos <= paddleLeftPos + 30 && ballLeftPos >= paddleLeftPos - 170;
}


//-------------------------VIEW-------------------------
//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------




//-------------------------PADDLEVIEW-------------------


const setPaddlePosOnMouseMove = function(mouseCurrentPos, paddleId) {
  let paddleWidth = paddleId.offsetWidth;
  let maxRange = 785;
  let minRange = -45;
  let newCoordinate = game.getXCoordinateOnMouseMove(mouseCurrentPos, paddleWidth);
  if (isMouseInRange(maxRange, minRange, newCoordinate)) {
    paddleId.style.left = newCoordinate + "px";
  }
};

const setPaddleIncreasedPosition = function(paddleId) {
  let minRange = -30;
  let pixelsToMove = 20;
  let decreasedXCoordinate = game.getDecreasedXCoordinate(pixelsToMove, minRange);
  paddleId.style.left = decreasedXCoordinate + "px";
};


const setPaddleDecreasedPosition = function(paddleId) {
  let maxRange = 762;
  let pixelsToMove = 20;
  let increasedXCoordinate = game.getIncreasedXCoordinate(pixelsToMove, maxRange);
  paddleId.style.left = increasedXCoordinate + "px";
};

//------------------------------BALLVIEW-----------------------------

const setBallPosition = function() {
  let maxCoordinates = [970, 570];
  let minCoordinates = [0, 0];
  let ballId = document.getElementById("ballField");
  let newCoordinate = game.getBallNewCoordinates(maxCoordinates, minCoordinates);
  ballId.style.left = newCoordinate[0] + "px";
  ballId.style.top = newCoordinate[1] + "px";
  checkForFinish(ballId);
  addScore(ballId);
};



//--------------------------------main-------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------


const startGame = function() {
  addClickListenerOnButtons();
};

window.onload = startGame;
