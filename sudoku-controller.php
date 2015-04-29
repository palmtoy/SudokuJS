<?php

require_once("php/SudokuReader.php");


define("SUDOKU_PUZZLE_PATH", "puzzles");
define("SUDOKU_CACHE_PATH", "sudoku-cache");

define("SUDOKU_PUZZLE_PATH_FREE", "puzzles-free");
define("SUDOKU_CACHE_PATH_FREE", "sudoku-cache-free");

if(isset($_POST['getRandom'])){

    $sudokuReader = new SudokuReader();

    if(isset($_POST['commercial'])){
        $sudokuReader->useCommercial();
    }
    if(isset($_POST['level'])){
        echo json_encode($sudokuReader->getRandomBy($_POST['level']));
    }else{

        echo json_encode($sudokuReader->getRandom());
    }
}