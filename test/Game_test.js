var Game = require('../Game.js');
var chai = require("chai");
var expect = chai.expect;
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);
 

//make sure that method used for receiving user input works
describe("Game - getInput(prompt)", function() { 
	var game; 
  beforeEach(function () {
		game = new Game(); 
		//stub game.listen, to prevent it from listening for input and keeping the process open after test finishes
		var listenStub = sinon.stub(game, "listen");
  });
	 
		
	it("should return a promise that resolves with the next input value sent to game.inputCB", function() {
		//wait for next event loop tick, then send test input to the input callback
		process.nextTick(function mockResponse() {
      game.inputCB("test input");
    });
		
		
		return game.getInput()
			.then(function (response) {
				//response should be equal to the value sent to inputCB
				console.assert(response == "test input");
			});
	});
	
	it("should call process.stdout.write with the given prompt", function() { 
		//stub process.stdout.write so we can examine it's calls
		var writeStub = sinon.stub(process.stdout, "write");
		
		game.getInput("test prompt");
		
		//check that process.stdout.write was called with the test prompt
		writeStub.should.have.been.calledWith("test prompt");
		//restore process.stdout.write so that mocha can continue writing the test results to the console
		writeStub.restore();
	});
});



describe("Game - getInputs(prompts)", function() { 
	var game; 
  beforeEach(function () {
		game = new Game(); 
		//stub game.listen, to prevent it from listening for input and keeping the process open after test finishes
		var listenStub = sinon.stub(game, "listen");
  });
	 
		
	it("should return a promise that resolves with an array of input values entered into the console, in order, and of the same length as the number of parameters passed into the function", function() {
		//wait for next event loop tick, then send test input to the input callback
      process.nextTick(function mockResponse() {
        game.inputCB("test input");
        
        process.nextTick(function mockResponse2() {
          game.inputCB("test input 2");
        })
      });
		
		
		return game.getInputs(" ", " ")
			.then(function (response) {
              expect(response[0]).to.be.equal("test input");
              expect(response[1]).to.be.equal("test input 2");
              expect(response.length).to.be.equal(2);
			});
	});
  
  
	 
});


//make sure both users are initialized correctly and playerX goes first when the game is started
describe("Game - startGame()", function() {
	var game; 
  beforeEach(function () {
		game = new Game(); 
		//stub game.listen, to prevent it from listening for input and keeping the process open after test finishes
		var listenStub = sinon.stub(game, "listen");
  });
	
	it("should initialize playerX and playerO's marks, and set playerX as the currentPlayer", function() {
		//stub startTurn so it doesn't get called and start writing to the console
		var startTurnStub = sinon.stub(game, "startTurn");
		
		//start the game
		game.startGame();

		//make sure playerX's mark is X and playerO's mark is O
		expect(game.playerX.mark).to.be.equal("X");
		expect(game.playerO.mark).to.be.equal("O");
		//playerX goes first
		expect(game.currentPlayer).to.be.equal(game.playerX); 
	});
});





//make sure that endTurn is called when the player makes a valid move, but not before
 
describe("Game - getMove()", function() {
	var game; 
  beforeEach(function () {
		game = new Game(); 
		//stub game.listen, to prevent it from listening for input and keeping the process open after test finishes
		var listenStub = sinon.stub(game, "listen");
  });
	
	
	it("should call itself again repeatedly until tryMove returns true", function() {  
		//so that game doesn't actually start when startGame() is called
		var startTurnStub = sinon.stub(game, "startTurn");
		//stub stdout.write so that tests don't get cluttered with console output from the game 
		var getMoveSpy = sinon.spy(game, "getMove");
		//making this a blank function so that it's output doesn't clutter the console
		game.invalidMove = function() {};
		//set up test moves that will be returned to getMove by currentPlayer.requestMove 
		
		//start the game
		game.startGame();
		 
		//mock currentPlayer.requestMove
		game.currentPlayer = {
			//instead of returning a promise(which makes things difficult to test), just return an object with a 'then' function that evaluates immediately
			requestMove: function() { 
				return {
					then: function(func) {
						func([0, 0]);
					}
				}
			},
			updateScore: function() {}
		}
		//mock board.tryMove to increment curMove and keep returning false until curMove = 5;
		game.board = {
			tryMove: function() {
				curMove = curMove + 1;
				if (curMove == 5)
					return true;
				else 
					return false;
			}
		}
		var curMove = 0;
		
		game.getMove(); 
		
		//if getMove keeps executing until requestMove gives a valid move, then it should stop when there is 1 move left
		expect(curMove).to.be.equal(5);
	});
	
	it("should call endTurn when a valid move is made", function() {
		var endTurnStub = sinon.stub(game, "endTurn");
		//so that game doesn't actually start when startGame() is called
		var startTurnStub = sinon.stub(game, "startTurn");
		//start the game
		game.startGame();
		//simple mock for requestMove. instead of waiting for user input, just return the move 1, 1
		game.currentPlayer.requestMove = function() { 
			return {
				then: function(func) {
					func([1, 1]);
				}
			}
		}
		var endTurnCount = 0;
		game.endTurn = function() {
			endTurnCount++;
		}
		
		game.getMove();
		
		//endTurn should have been called exactly once, since the first move given is valid
		expect(endTurnCount).to.be.equal(1); 
		
	});
});

describe("Game - endTurn()" , function() {
	var game;
	beforeEach(function() {
		game = new Game();
		//stub game.listen, to prevent it from listening for input and keeping the process open after test finishes
		var listenStub = sinon.stub(game, "listen");
	});
	
	
	it("should call gameOver if the current player has won", function() { 
		//stub for gameOver method, to count how many times it is called
		var gameOverStub = sinon.stub(game, "gameOver"); 
		//mock currentPlayer and pretend she has won
		game.currentPlayer = {
			isWinner: true
		}
		
		game.endTurn();
		 
		//the test: gameOver should have been called exactly once
		expect(gameOverStub.callCount).to.be.equal(1);
	});
	
	it("should call startTurn if the current player hasn't won", function() {
		//stub for gameOver method, prevent it from clutting console if it gets called(which should only happen in situations where this test fails, but that would still be confusing)
		var gameOverStub = sinon.stub(game, "gameOver");
		//stub startTurn method to count how many times it is called
		var startTurnStub = sinon.stub(game, "startTurn"); 
		game.currentPlayer = {
			isWinner: false,
			mark: "X"
		}
		
		game.endTurn();
		
		expect(startTurnStub.callCount).to.be.equal(1);
	});
	
	it("should switch the currentPlayer, if the currentPlayer hasn't won the game already", function() {
		//stub for gameOver method to prevent it from being called and clutting console
		var gameOverStub = sinon.stub(game, "gameOver");
		//stub startTurn method to prevent it from being called and starting game loop, causing unintended side-effects
		var startTurnStub = sinon.stub(game, "startTurn"); 
		game.playerX = {
			mark: "X",
			isWinner: false
		}
		game.playerO = {
			mark: "O",
			isWinner: false
		}
		game.currentPlayer = game.playerX;
		
		//the test: currentPlayer should be playerX to start, then switch to playerO after one turn, then back to playerX after the 2nd turn
		expect(game.currentPlayer).to.be.equal(game.playerX);
		game.endTurn();
		expect(game.currentPlayer).to.be.equal(game.playerO);
		game.endTurn();
		expect(game.currentPlayer).to.be.equal(game.playerX);
	});
	 
});

















