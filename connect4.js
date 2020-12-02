/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = Math.round(window.innerWidth / 100);
const HEIGHT = Math.round(window.innerHeight / 100);

let currPlayer = 'one'; // active player: 1 or 2
var board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

// making an empty board based on...?
function makeBoard() {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	//check width and height of screen then change WIDTH and HEIGHT variable

	for (let i = 0; i < HEIGHT; i++) {
		board.push([]);
		for (let j = 0; j < WIDTH; j++) {
			board[i].push(null);
		}
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
	// TODO: get "htmlBoard" letiable from the item in HTML w/ID of "board"
	let htmlBoard = document.querySelector('table');

	// TODO: add comment for this code
	//top is a created table row
	let top = document.createElement('tr');
	//labeling id as column top
	top.setAttribute('id', 'column-top');
	//adding an event listener to the top table row
	top.addEventListener('click', handleClick);

	//make table data cells for top row and set id to the WIDTH index, append to top row
	for (let x = 0; x < WIDTH; x++) {
		let headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	//make remaining rows below top row with td cells and id (e.g 2-5 where 2 is the row number and 5 is the data cell number
	// TODO: add comment for this code
	for (let y = 0; y < HEIGHT; y++) {
		let row = document.createElement('tr');
		row.setAttribute('id', `row${y}${y}`);
		for (let x = 0; x < WIDTH; x++) {
			let cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
// this function determined spot in column

function findSpotForCol(x) {
	// TODO: write the real version of this, rather than always returning 0
	let spot;
	for (let i = HEIGHT - 1; i >= 0; i--) {
		if (board[i][x] === null) {
			return (spot = i);
		}
	}
	// check each xth element in each array element form the bottom
	// if element is null, return that index
	//if all elements not null, return undefined
	console.log(spot);
	return spot;
}

/** placeInTable: update DOM to place piece into HTML table of board */
// this function places the new circle into the column

function placeInTable(y, x) {
	// TODO: make a div and insert into correct table cell
	//x is the column #
	//y is a one digit number that returns the empty spot in that column. 0 is b

	let finalLoc = `${y}-${x}`;
	//console.log(finalLoc);
	let dataCell = document.getElementById(finalLoc);
	//console.log(dataCell);
	//create dive
	let chip = document.createElement('div');
	//set div class
	chip.setAttribute('class', `piece ${currPlayer}`);
	console.log(chip);
	//add circle color chip to the data cell
	dataCell.append(chip);
}

/** endGame: announce game end */

function endGame(msg) {
	//make board unclickable
	const gameBoard = document.getElementById('game');
	gameBoard.classList.toggle('nopointerclass');
	//start animation
	endAnim();
	//toggle animation off
	setTimeout(endAnim, 4000);
	//clear HTML board pieces
	setTimeout(clearHTMLBoard, 5000);
	//clear board
	board = [];
	makeBoard();
	//make board clickable again
	setTimeout(function() {
		gameBoard.classList.toggle('nopointerclass');
	}, 7000);
}

//end game animation
//determine all slots in on the board
//place token of winner in all slots
function endAnim() {
	//let allTD = document.querySelectorAll('td');

	for (let i = 0; i < HEIGHT; i++) {
		//all TD with id ending in "-0" and "-WIDTH" toggle to endclass

		let row = document.getElementById(`row${i}${i}`);
		let rowChildren = row.children;

		setTimeout(addEndClass, 1000 + 200 * i);

		function addEndClass() {
			for (let sub of rowChildren) {
				sub.classList.toggle('endclass');
			}
		}
	}

	//or (let items of allTD) {
	//items.classList.toggle('endclass');
	//}
}

function clearHTMLBoard() {
	let allPieces = document.querySelectorAll('.piece');
	for (let subs of allPieces) {
		subs.remove();
	}
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// x is column num

	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table

	let boardLoc = board[y][x];
	console.log('boardLoc is ' + boardLoc);
	if (boardLoc === null) {
		board[y][x] = currPlayer;
	}

	// TODO: add line to update in-memory board

	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie

	// TODO: check if all cells in board are filled; if so call, call endGame
	let anyNull = board.find(function(boardRow) {
		return boardRow.find(function(val) {
			return val === null;
		});
	});
	//if anynull is true it means there still empty/null spaces
	if (anyNull !== true) {
		endGame;
	}

	// switch players
	currPlayer === 'one' ? (currPlayer = 'two') : (currPlayer = 'one');
	// TODO: switch currPlayer 1 <-> 2
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	//accepts array called cells
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer
		// y is greater than or equal to 0 AND y is less than height and x is greater than or equal to 0
		//and  X IS less than width and the slot is equal to the current player
		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	// TODO: read and understand this code. Add comments to help you.
	//occurs a fter new position added
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
