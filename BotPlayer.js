var Board = require('./Board.js');
var Game = require('./Game.js');
var Player = require('./Player.js');


class BotPlayer extends Player {
	
	requestMove(board) { 
		return new Promise((resolve, reject) => {
          resolve(this.findBestMove(board.board));
        });
	} 
	
	findBestMove(board) {
      // simulates game and uses miniMax algorithm to find best possible move
      var move = this.simulateGame(board);
      return [move.row, move.col];
	}
  
    // simulates the board an both opponents, copying the games current state
    simulateGame(board) {
      var simBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // simulated board is a 1d array to make the algorithm simpler
      var simSelf = new Player(this.game);
      var simOpponent = new Player(this.game);
      
      // initialize simulated players
      simSelf.initPlayer('O');
      simOpponent.initPlayer('X');
      
      // loop over the board, and convert/copy all the moves over from the real board to the simulated board
      for (var y in board) {
        for (var x in board[y]) { 
          x = Number(x);
          y = Number(y);
          
          if (board[y][x] == 'X') {
            simOpponent.updateScore(y, x); // adds score to simulated player as it goes to copy current score of real players 
            simBoard[y * 3 + x] = 'X';
          } else if (board[y][x] == 'O') {
            simSelf.updateScore(y, x); // adds score to simulated player as it goes to copy current score of real players
            simBoard[y * 3 + x] = 'O';
          } 
          
        }
      }
      
      // run through all the possibilities with simulated board/players and find the best possible move for the next turn, and return it
      return this.miniMax(simBoard, simSelf, simOpponent, simSelf);
    }
  
	/** 
    * examine all possible moves for curPlayer in the simulated board
    * simulate each move and update simBoard.. then call self recursively to find next moves until game-over state is reached
	* then calculate score based on outcome of game and return it. 
    * Finally, compare all possible moves for the next turn and their eventual outcomes/scores,
    * and return the move with the best score(if curPlayer is bot, best score is highest, if curPlayer is opponent, best score is lowest)
    *
    * @param simBoard, [] - an array containing the simulated boards cells. empty cells have a value equal to their index
    * @param simSelf, Player - the player executing the algorithm(the bot)
    * @param simOpponent, Player - the opponent of the player executing the algorithm(human player)
    * @param curPlayer, Player - the player who's turn is being simulated
    *
    * @return {} - an object containing a move(row + col) and a score. The object returned by the top-level/first call to miniMax will
    *             be the best possible move to make
    **/
    miniMax(simBoard, simSelf, simOpponent, curPlayer) {
      // initialize players to reset their scores for this simulation
      simSelf.initPlayer('O');
      simOpponent.initPlayer('X');
      
      var openCells = []; // array that will contain all available moves on the simulated board
      // loop through simBoard cells and update players scores to match simulated board
      for (var i = 0; i < simBoard.length; i++) {
        if (simBoard[i] == 'X') {
          simOpponent.updateScore(Math.floor(i / 3), i % 3);
        } else if (simBoard[i] == 'O') {
          simSelf.updateScore(Math.floor(i / 3), i % 3);
        } else {
          // if no mark is in the cell add it to openCells
          openCells.push(i);
        }
      }
      
      
      if (simSelf.isWinner) { // if bot is winner return an object with a score of 10
        return {score: 10};
      } else if (simOpponent.isWinner) { // if opponent is winner return object with score of -10
        return {score: -10};
      } else if (openCells.length == 0) { // if nobody won but the are no open cells left, return obj with score of 0
        return {score: 0};
      }
      
      var moves = []; // array that will contain all possible moves and their scores
      
      // loop through all of the open cells, simulate placing curPlayers mark in that cell, then call miniMax again to simulate subsequent moves until game-over state is reached. Add move objects returned by minimax to moves array
      for (var i = 0; i < openCells.length; i++) {
        var move = {};
        move.index = openCells[i]; // store the index of the move, to keep track of where the move being simulated is on the board
        
        simBoard[openCells[i]] = curPlayer.mark; // simulated current player placing their mark in an open cell
        
        // call minimax with the updated board, and switch current player to simulate other players turn. //store score in move object
        if (curPlayer == simSelf) {
          move.score = this.miniMax(simBoard, simSelf, simOpponent, simOpponent).score;
        } else {
          move.score = this.miniMax(simBoard, simSelf, simOpponent, simSelf).score;
        }
        
        moves.push(move); // add move to moves array
        simBoard[openCells[i]] = openCells[i]; // undo the move that was simulated to reset simBoard back to original state
      }
      
    
      var bestMove; // store the best move
      if (curPlayer == simSelf) { //if bot is curPlayer, best score would be high, so set initial value to a low number
        bestMove = {score: -100};
      } else { // if bots opponent is curPlayer, best score would be a low score, so set inital value to a high number
        bestMove = {score: 100};
      }
      
      // loop through all moves, searching for the best move
      for (var i = 0; i < moves.length; i++) {
        //if bot is curPlayer, and moves[i] has a higher score than current best move, update bestMove and set it to moves[i]
        if (curPlayer == simSelf && moves[i].score > bestMove.score) {
          bestMove = moves[i];
        }
        //if bots opponent is curPlayer, and moves[i] has lower score than bestMove, update bestMove and set it to moves[i]
        if (curPlayer != simSelf && moves[i].score < bestMove.score) {
          bestMove = moves[i];
        }
      }
      
      // convert bestMove to a row and column to be used on real board. row = floor(index / 3), col = index MOD 3
      bestMove.row = 1 + Math.floor(bestMove.index / 3); //0, 1, 2 = 0  |  3, 4, 5
      bestMove.col = 1 + bestMove.index % 3;
      
      return bestMove; // return the bestMove!
	}
  
    
}


module.exports = BotPlayer;