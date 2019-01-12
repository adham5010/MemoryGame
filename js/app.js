/*********** Global variables declaration ***********/

// Init game on DOM ready
document.addEventListener("DOMContentLoaded", startPlay, true);

// Listen on restart button to restart the game
document.querySelector(".restart").addEventListener("click",startPlay, true);
//listen on Button Play Again Click
document.querySelector('#playAgain').addEventListener("click",startPlay, true);


// Game board
const board = document.getElementById("board");

// Stars containers
const stars = document.querySelectorAll(".fa-star");

// Variable to store final stars
let finalStars = 3;

// Main & Modal containers
const mainContainer = document.querySelector(".container");
const modalContainer = document.querySelector(".modal");

// Selects moves span
const moves = document.querySelector(".moves");

// Temporal opened cell
let _openedcell = null;

// To count matched cells
let matchesCounter = 0;

// Variables for timer purposes
let seconds = 0, minutes = 0, hours = 0, t;

// Span to show timer
let spanTimer = document.querySelector(".timer");

//array shuffle
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
 * @description Resets and prepare the board to start a new board
*/
function ClearGame() {
	// Clear timer and starts it again
	clearTimeout(t);
	spanTimer.textContent = "00:00:00";
	seconds = 0, minutes = 0, hours = 0;
	timer();

	// Show main container and hides modal
	mainContainer.classList.remove("hidden");
	modalContainer.classList.add("hidden");

	// Clear moves text
	moves.textContent = "0";

	// Reset stars
	stars[1].classList.add("fa-star");
	stars[1].classList.remove("fa-star-o");
	stars[2].classList.add("fa-star");
	stars[2].classList.remove("fa-star-o");

	// Temporal cell set to null to be able to compare again
	_openedcell = null;

	// Reset matches counter
	matchesCounter = 0;
}

/**
 * @description Initializes a new game
*/
function startPlay() {
	// Clears board and variables to start a new game
	ClearGame();

	// Gets HTML items
	const cells = board.querySelectorAll(".card");

	// Suffles the cells object to generate new board
	const suffledcells = shuffle(Array.from(cells));

	// Clear previews board
	board.innerText = '';

	// Iterates over suffledcells to create the new board
	for (let i = 0; i < suffledcells.length; i++) {
		let cell = suffledcells[i];
		cell.classList.remove("show", "open", "match", "rubberBand", "shake");
		cell.addEventListener("click", flipcell, true);
		board.appendChild(cell);
	}
}

/**
 * @description Flip cells to show its content
*/
function flipcell(evt) {
	// Gets current moves text
	const currentMoves = +moves.textContent;

	// Clicked cell
	const cell = evt.target;

	// Sets open and show classes to cell to show its content
	cell.classList.add("open", "show");

	// Check if this is the first clicked cell
	if (!_openedcell) {
		// Temporal saved cell
		_openedcell = cell;
	} else {
		// Add disabled class to board to prevent multiple cells opened
		board.classList.add("disabled");
		// Increases moves count
		moves.textContent = currentMoves + 1;

		// Compare classes to see it both cells matches
		if (_openedcell.classList[1] === cell.classList[1]) {
			setTimeout(function() {
				// Set match class to cells and rubberBand animation
				cell.classList.add("match", "rubberBand");
				_openedcell.classList.add("match", "rubberBand");

				// Remove open and show classes
				_openedcell.classList.remove("open", "show");
				cell.classList.remove("open", "show");

				// Temporal cell set to null to be able to compare again
				_openedcell = null;

				// This counter let us know how many matches has the user
				matchesCounter += 1;

				// Toggle stars
				toggleStars();

				// If matches counter is equal to 8 it means the user has won
				if (matchesCounter === 8) {
					// Manage winning
					showResult();
				}
				
				// Remove disabled class from board to continue playing
				board.classList.remove("disabled");
			}, 100);
		} else {
			// Means cells didn't match
			_openedcell.classList.add("wrong", "shake");
			cell.classList.add("wrong", "shake");

			setTimeout(function() {
				// Removes all classes added previously
				_openedcell.classList.remove("open", "show", "wrong", "shake");
				cell.classList.remove("open", "show", "wrong", "shake");

				// Temporal cell set to null to be able to compare again
				_openedcell = null;

				// Remove disabled class from board to continue playing
				board.classList.remove("disabled");
			}, 500);
		}
	}
}

/**
 * @description Toggle stars depending on succesfull cell matches
*/
function toggleStars() {
	if (matchesCounter === 3) {
		stars[2].classList.remove("fa-star");
		stars[2].classList.add("fa-star-o");
		finalStars = 2;
	} else if (matchesCounter === 6) {
		stars[1].classList.remove("fa-star");
		stars[1].classList.add("fa-star-o");
		finalStars = 1;
	}
}

/**
 * @description Manage when user has Won
*/
function showResult() {
	// Selects moves and time
	const finalMoves = moves.textContent;
	const finalTime = spanTimer.textContent;

	// Final moves span
	const finalMovesSpan = document.getElementById("finalMoves");

	// Final stars span
	const finalStarsSpan = document.getElementById("finalStars");

	// Final time spam
	const finalTimeSpan = document.getElementById("finalTime");

	// Set results
	finalMovesSpan.textContent = finalMoves;
	finalStarsSpan.textContent = finalStars;
	finalTimeSpan.textContent = finalTime;

	// Stops timer
	clearTimeout(t);

	// Hide main container and show modal
	mainContainer.classList.add("hidden");
	modalContainer.classList.remove("hidden");
}

/**
 * @description Timer controller
*/
function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    spanTimer.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}

/**
 * @description Initializes timer
 */
function timer() {
    t = setTimeout(add, 1000);
}
// End of timer controller
