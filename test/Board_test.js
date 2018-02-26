var Board = require('../Board.js');
var expect = require('Chai').expect;




describe("Board - board", function() {
	var board;
	
	beforeEach(function() {
    board = new Board(); 
  });
	
	it("should be a 3x3 array, with each element being a string consisting of a single space", function() {
		expect(board.board.length).to.be.equal(3);
		expect(board.board[0].length).to.be.equal(3);
		expect(board.board[1].length).to.be.equal(3);
		expect(board.board[2].length).to.be.equal(3);
	});
	
});

describe("Board - tryMove(row, col, mark)", function() {
	var board;
	
	beforeEach(function() {
    board = new Board(); 
  });
	
	
	it("should return true for moves where row and col are both either 1, 2, or 3, and the same move has not been made already", function() {
		expect(board.tryMove(0, 0, 'X')).to.be.equal(true);
		expect(board.tryMove(1, 1, 'X')).to.be.equal(true);
		expect(board.tryMove(2, 2, 'X')).to.be.equal(true);
	});
	
	it("should return false for moves where the same move has been made already", function() {
		expect(board.tryMove(1, 1, 'X')).to.be.equal(true);
		expect(board.tryMove(1, 1, 'X')).to.be.equal(false);
	});
	
	it("should return false for moves where mark is not either 'X' or 'O'", function() {
		expect(board.tryMove(1, 1, 'A')).to.be.equal(false);
		expect(board.tryMove(1, 1, '')).to.be.equal(false);
		expect(board.tryMove(1, 1, " ")).to.be.equal(false);
	});
	
	it("should return false for moves where row or col is less than 0", function() {
		expect(board.tryMove(-1, 1, 'X')).to.be.equal(false);
		expect(board.tryMove(1, -1, 'O')).to.be.equal(false);
	})
	
});
/**

describe('isMoveValid(row, col)', function() {
	var board;
	
	beforeEach(function() {
    board = new Board(); 
  });
	
	it("should return true for moves where row is 0, 1, or 2 and col is 0, 1, or 2, on an empty board", function() {
		
		expect(board.isMoveValid(0, 0)).to.be.equal(true);
		expect(board.isMoveValid(0, 1)).to.be.equal(true);
		expect(board.isMoveValid(0, 2)).to.be.equal(true);
		expect(board.isMoveValid(0, 0)).to.be.equal(true);
		expect(board.isMoveValid(1, 0)).to.be.equal(true);
		expect(board.isMoveValid(2, 0)).to.be.equal(true);
	});

	it("should return false for moves where row or col is less than 0", function() {
		
		expect(board.isMoveValid(-1, 1)).to.be.equal(false);
		expect(board.isMoveValid(1, -1)).to.be.equal(false);
	});
	
	it("should return false for moves where row or col is greater than 2", function() {
		
		expect(board.isMoveValid(3, 1)).to.be.equal(false);
		expect(board.isMoveValid(1, 3)).to.be.equal(false);
	});
	
	it("should return false if the cell specified by row and col is already taken from a previous move", function() {
		
		board.placeMove(1, 1, 'X');
		expect(board.isMoveValid(1, 1)).to.be.equal(false);
	});
});


describe("placeMove(row, col, mark)", function() {
	var board;
	
	beforeEach(function() {
    board = new Board(); 
  });
	
	it("should set the value of board[1, 2] to 'X' when called with placeMove(1, 2, 'X')", function() {
		board.placeMove(1, 2, 'X');
		expect(board.board[1][2]).to.be.equal('X');
	});
	
	it("should throw an error when row or col is less than 0", function() {
		expect(board.placeMove.bind(this, -1, 1, 'X')).to.throw("Argument Out Of Range Exception - row is less than 0 or greater than 2");
		expect(board.placeMove.bind(this, 1, -1, 'X')).to.throw("Argument Out Of Range Exception - col is less than 0 or greater than 2");
	});
	
	it("should throw an error when mark is not 'X' or 'O'", function() {
		expect(board.placeMove.bind(this, 1, 1, 'A')).to.throw("Invalid Argument Exception - Mark is not 'O' or 'X'");
		expect(board.placeMove.bind(this, 1, 1, '')).to.throw("Invalid Argument Exception - Mark is not 'O' or 'X'");
	});
	
});

**/