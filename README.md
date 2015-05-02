# SudokuJS

Sudoku DHTML and PHP Script

The Javascript and PHP is under open source license(BSD)

There is a commercial license for the puzzles found in the puzzles folder. By purchasing a commercial license, you are free to use the puzzles provided with the script. With the free licence, you can use the script to render your own Sudoku Puzzles.

The format of the puzzles are:

Line 1: 81 character string of the puzzles shown to the user where 0 represents empty cells

Line 2: 81 character string of the solution

#Javascript "classes"
Sudoku.Board - Board View

Sudoku.Buttons - Button bar for the Sudoku

Sudoku.NewGameDialog - Dialog for starting a new game

Sudoku.SolvedDialog - Dialog shown when sudoku is solved


#USAGE
1) Create views and render them to empty &lt;div> elements on the web page
Example:

```html
<div id="button_bar_container"></div>
``

```javascript
// Create board and render it to <div id="board_container">
var board = new Sudoku.Board({
    renderTo: '#board_container'
});

```

2) Create the controller and make the controller aware of available views

```javascript
// Create controller
var controller = new Sudoku.Controller({
    commercial: true // Set to true ONLY after purchasing a commercial license
});
// Make controller aware of views
controller.setButtonBar(buttonBar);
controller.setBoard(board);
controller.setNewGameDialog(newGameDialog);
controller.setSudokuSolvedView(solvedView);
```
The controller loads Sudoku Puzzles from the server and handles interactions between the views

# Complete Code sample

```javascript
// Text descriptions - levels
var difficulties = [
    'Very easy', 'Easy', 'Easy', 'Moderate', 'Moderate', 'Hard', 'Very Hard', 'Extreme'
];

// Create button bar and render it to <div id="button_bar_container">
var buttonBar = new Sudoku.Buttons({
    renderTo: '#button_bar_container'
});

// Create board and render it to <div id="board_container">
var board = new Sudoku.Board({
    renderTo: '#board_container'
});

// New Game Dialog
var newGameDialog = new Sudoku.NewGameDialog({
    renderTo: '#board_container',
    difficulty: 1 // Default difficulty
});

// Sudoku Solved view - shown when sudoku is solved
var solvedView = new Sudoku.SudokuSolvedDialog({
    renderTo: '#board_container',
    txtNewGame: 'New Game' // Button text - new game
});


// Create controller
var controller = new Sudoku.Controller({
    commercial: true // Set to true ONLY after purchasing a commercial license
});
// Make controller aware of views
controller.setButtonBar(buttonBar);
controller.setBoard(board);
controller.setNewGameDialog(newGameDialog);
controller.setSudokuSolvedView(solvedView);

// When a model is loaded, update textual description above board
$(controller).on("loadmodel", function (event, model) {
    $("#puzzle_description").text(difficulties[model.getLevel() - 1]);
});

if (controller.hasGameToResume()) {
    // puzzle saved in local storage(browser) - resume it
    controller.resume();
} else {
    // Show new game dialog
    controller.showEmptyBoard();
    newGameDialog.show();
}
```