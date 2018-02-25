var HumanPlayer = require('../HumanPlayer.js');
var Game = require('../Game.js');
var expect = require('Chai').expect;




describe("HumanPlayer - initPlayer(mark)", function() {
	var player
	
    beforeEach(function() {
      player = new HumanPlayer(new Game()); 
    });
	
	it("should set all scores to 0", function() {
		player.initPlayer('X');
        for (var i in player.rowScores) {
          expect(player.rowScores[i]).to.be.equal(0);
        }
        for (var i in player.colScores) {
          expect(player.colScores[i]).to.be.equal(0);
        }
        for (var i in player.diagScores) {
          expect(player.diagScores[i]).to.be.equal(0);
        }
	});
  
    it("should set the players mark to whatever value is passed in", function() {
        var mark1 = 'X';
        var mark2 = 'O';
      
		player.initPlayer(mark1);
        expect(player.mark).to.be.equal(mark1);
        
        player.initPlayer(mark2);
        expect(player.mark).to.be.equal(mark2);
      
    });
  
    it("should throw an error if a string value isn't passed as the argument", function() {
      var mark = 5;
      try{
        expect(player.initPlayer.bind(player, mark)).to.throw("mark must be of type 'string', instead received number");
      } finally {
        
      }
    });
});

describe("HumanPlayer updateScore(row, col)", function() {
	var player
	
    beforeEach(function() {
      player = new HumanPlayer(new Game()); 
			//custom initPlayer, to separate functionality of default initPlayer function from these tests
			player.customInitPlayer = function() {
				this.rowScores = [[], [], []];
				this.colScores = [[], [], []];
				this.diagScores = [[], []];
				this.isWinner = false;
			}
    });
  
    it("should set player.isWinner to true if updateScores is called for all 3 of the spaces in any row", function() {
			player.customInitPlayer('X');
      expect(player.isWinner).to.be.equal(false);
      player.updateScore(0, 0);
      player.updateScore(0, 1);
      player.updateScore(0, 2);
      expect(player.isWinner).to.be.equal(true);
      
			player.customInitPlayer('O');
			expect(player.isWinner).to.be.equal(false);
      player.updateScore(1, 0);
      player.updateScore(1, 1);
      player.updateScore(1, 2);
      expect(player.isWinner).to.be.equal(true);
			
			player.customInitPlayer('X');
			expect(player.isWinner).to.be.equal(false);
      player.updateScore(2, 0);
      player.updateScore(2, 1);
      player.updateScore(2, 2);
			expect(player.isWinner).to.be.equal(true);
    });
  
    it("should set player.isWinner to true if updateScores is called for all 3 of the spaces in any column", function() {
			player.customInitPlayer('X');
			expect(player.isWinner).to.be.equal(false);
      player.updateScore(0, 0);
      player.updateScore(1, 0);
      player.updateScore(2, 0);
			expect(player.isWinner).to.be.equal(true);
			
      player.customInitPlayer('O');
      expect(player.isWinner).to.be.equal(false);
      player.updateScore(0, 1);
      player.updateScore(1, 1);
      player.updateScore(2, 1);
      expect(player.isWinner).to.be.equal(true);
      
			player.customInitPlayer('X');
			expect(player.isWinner).to.be.equal(false);
      player.updateScore(0, 2);
      player.updateScore(1, 2);
      player.updateScore(2, 2);
      expect(player.isWinner).to.be.equal(true);
    });
	
		it("should set player.isWinner to true if called for all 3 moves in either diagonal", function() {
			player.customInitPlayer('X');
			expect(player.isWinner).to.be.equal(false);
			player.updateScore(0, 0);
			player.updateScore(1, 1);
			player.updateScore(2, 2,);
			expect(player.isWinner).to.be.equal(true);
			
			player.customInitPlayer('O');
			expect(player.isWinner).to.be.equal(false);
			player.updateScore(0, 2);
			player.updateScore(1, 1);
			player.updateScore(2, 0);
			expect(player.isWinner).to.be.equal(true);
		})
		it("should throw an error if row or col are any numbers besides 0, 1, and 2", function() {
			var row = 1;
			var col = 5;
			player.customInitPlayer('X');
			
			expect(player.updateScore.bind(player, row, col)).to.throw("row and col must both be between 0 and 2(inclusive), got " + row + " and " + col);
			
			row = -2;
			col = 2;
			expect(player.updateScore.bind(player, row, col)).to.throw("row and col must both be between 0 and 2(inclusive), got " + row + " and " + col);
		});
	
		it("should not set player.isWinner to true if it is not called with 3 moves in the same row, column, or diagonal", function() {
			player.customInitPlayer("O");
			expect(player.isWinner).to.be.equal(false);
			player.updateScore(0, 0);
			player.updateScore(0, 1);
			player.updateScore(1, 0);
			player.updateScore(1, 2);
			player.updateScore(2, 1);
			player.updateScore(2, 2);
			expect(player.isWinner).to.be.equal(false);
		})
});









