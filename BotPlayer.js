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
      var move = this.simulateGame(board);
      console.log("\n\nTrying Move: ", move);
      return [move.row, move.col];
	}
  
  
    simulateGame(board) {
      var simBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      var simSelf = new Player(this.game);
      var simOpponent = new Player(this.game);

      simSelf.initPlayer('O');
      simOpponent.initPlayer('X');
      
      for (var y in board) {
        for (var x in board[y]) { 
          x = Number(x);
          y = Number(y);
          
          if (board[y][x] == 'X') {
            simOpponent.updateScore(y, x);
            simBoard[y * 3 + x] = 'X';
          } else if (board[y][x] == 'O') {
            simSelf.updateScore(y, x);
            simBoard[y * 3 + x] = 'O';
          } 
          
        }
      }
      
      return this.miniMax(simBoard, simSelf, simOpponent, simSelf, true);
    }
  
	//look at board to examine all possible moves
    //check what the score would be for each move
    //if there are more spaces left, simulate s move and see what their best move would be
	miniMax(simBoard, simSelf, simOpponent, curPlayer, first) {
      simSelf.initPlayer('O');
      simOpponent.initPlayer('X');
      var openCells = [];
      for (var i = 0; i < simBoard.length; i++) {
        if (simBoard[i] == 'X') {
          //console.log("adding X at cell " + i);
          simOpponent.updateScore(Math.floor(i / 3), i % 3);
        } else if (simBoard[i] == 'O') {
          //console.log("adding O at cell " + i);
          simSelf.updateScore(Math.floor(i / 3), i % 3);
        } else {
          //console.log("adding [OPEN] at cell " + i);
          openCells.push(i);
        }
      }
      
      
      if (simSelf.isWinner) {
        if (first) {
          console.log("bot wins, returning 10.");
          console.log(" " + simBoard[0] + " - " + simBoard[1] + " - " + simBoard[2]);
          console.log(" " + simBoard[3] + " - " + simBoard[4] + " - " + simBoard[5]);
          console.log(" " + simBoard[6] + " - " + simBoard[7] + " - " + simBoard[8]);
          console.log("\n\n");
        }
        return {score: 10};
      } else if (simOpponent.isWinner) {
        /**
        console.log("opp wins, returning -10.");
        console.log(" " + simBoard[0] + " - " + simBoard[1] + " - " + simBoard[2]);
        console.log(" " + simBoard[3] + " - " + simBoard[4] + " - " + simBoard[5]);
        console.log(" " + simBoard[6] + " - " + simBoard[7] + " - " + simBoard[8]);
        console.log("\n\n");
        **/
        return {score: -10};
      } else if (openCells.length == 0) {
        /**
        console.log("\n\nno open cells, returning 0. \n");
        console.log(" " + simBoard[0] + " - " + simBoard[1] + " - " + simBoard[2]);
        console.log(" " + simBoard[3] + " - " + simBoard[4] + " - " + simBoard[5]);
        console.log(" " + simBoard[6] + " - " + simBoard[7] + " - " + simBoard[8]);
        console.log("\n rowScores: ", simSelf.rowScores);
        console.log("colScores: ", simSelf.colScores);
        console.log("diagScores: ", simSelf.diagScores);
        console.log("\n\n\n");
        **/
        return {score: 0};
      }
      
      var moves = [];
      //console.log("open cells: ", openCells);
      for (var i = 0; i < openCells.length; i++) {
        var move = {};
        move.index = openCells[i];
        
        simBoard[openCells[i]] = curPlayer.mark;
        
        if (curPlayer == simSelf) {
          move.score = this.miniMax(simBoard, simSelf, simOpponent, simOpponent).score;
        } else {
          move.score = this.miniMax(simBoard, simSelf, simOpponent, simSelf).score;
        }
        
        moves.push(move);
        simBoard[openCells[i]] = openCells[i];
      }
      
    
      var bestMove;
      if (curPlayer == simSelf) {
        bestMove = {score: -100};
      } else {
        bestMove = {score: 100};
      }
      
      for (var i = 0; i < moves.length; i++) {
        if (curPlayer == simSelf && moves[i].score > bestMove.score) {
          bestMove = moves[i];
        }
        if (curPlayer != simSelf && moves[i].score < bestMove.score) {
          bestMove = moves[i];
        }
      }
      
      bestMove.row = 1 + Math.floor(bestMove.index / 3); //0, 1, 2 = 0  |  3, 4, 5
      bestMove.col = 1 + bestMove.index % 3;
      //console.log("returning bestMove: ", bestMove);
      return bestMove;
	}
  
    
}


module.exports = BotPlayer;