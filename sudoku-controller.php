<?php
/**
Author: Alf Magne Kalleland
Copyright 2015 Cellar Labs AS, dhtmlgoodies.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

require_once("php/SudokuReader.php");


define("SUDOKU_PUZZLE_PATH", "puzzles");
define("SUDOKU_CACHE_PATH", "sudoku-cache");

define("SUDOKU_PUZZLE_PATH_FREE", "puzzles-free");
define("SUDOKU_CACHE_PATH_FREE", "sudoku-cache-free");

if(isset($_POST['getRandom'])){

    $sudokuReader = new SudokuReader();

    // IMPORTANT! If you have purchased a commercial license, enable the code below by removing the two comment slashes at the start of the line
    // $sudokuReader->useCommercial();

    if(isset($_POST['level'])){
        echo json_encode($sudokuReader->getRandomBy($_POST['level']));
    }else{

        echo json_encode($sudokuReader->getRandom());
    }
}