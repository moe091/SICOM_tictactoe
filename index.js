/**
Index.jx - Entry point into tic-tac-toe game


--- Some notes on my implementation ---

This is my implementation of tic-tac-toe. I decided to go with a mostly Object-oriented approach because I think it makes the most sense for the problem, and most of my game development experience is object-oriented.
It could have been done functionally just as easily, or maybe even more easily, but I think the OOP approach allowed me to write clearer, more understandable code that would be easier to expand on if necessary.




I also included some unnecessary optimizations(e.g checking for win-state in O(1) time) even though they aren't necessary on a 3x3 board, because they could easily be expanded to an NxN board and because it's
an opportunity to demonstrate some algorithm design/problem solving



I built the game to specifications:

 - 2-player tic-tac-toe game, alternatively asks users for their move, moves entered by asking for row and column, validate move and score the game after move is entered,
if the move is invalid inform the user, otherwise draw the updated board, continue to ask players for their moves until their is a winner or no space left on the board, ask if it should start a new game when game ends

but for the same reason that I added unnecessary optimizations, I also added in some extra features that didn't interrupt the described flow of the game, instead adding extra options on top of the game that 
can be ignored and don't interfere with the intended functionality

**/

const Game = require('./Game.js');

	
class App {
	constructor() { 
		this.inputCB = null;
		this.game;
		this.listen();
	}
	
	newGame() {
		this.game = new Game(this);
		this.game.startGame();
	}
	
			
	/**
	*	starts listening for input on the console. Sends all user-entered input to inputCB, passing it in as a Number parameter
	**/
	listen() {
		// add event listener to the stdin stream
		process.stdin.on('data', (response) => {
			// call the input callback with the users input when the event is triggered
			this.inputCB(Number(response));
		});
	}
	
	
	/**
	*	sets inputCB - the function which will be called each time a user enters input after listen() is called
	* 
	* @param cb Function() - the function to be called when user enters input, will be passed the users input as a parameter
	**/
	setInputCallback(cb) {
		this.inputCB = cb;
	}
	
	
	// stop the process to exit the game
	close() {
		process.exit();
	}
}

var app = new App();
app.newGame();
