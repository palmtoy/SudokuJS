<?php

require_once("php/SudokuReader.php");


define("SUDOKU_PUZZLE_PATH", "puzzles");
define("SUDOKU_CACHE_PATH", "sudoku_cache");

if(isset($_POST['getRandom'])){

    if(isset($_POST['level'])){
        $sudokuReader = new SudokuReader();
        echo json_encode($sudokuReader->getRandomBy($_POST['level']));
    }else{
        $sudokuReader = new SudokuReader();
        echo json_encode($sudokuReader->getRandom());
    }
}