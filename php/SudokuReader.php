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


/**
 * The 1600 puzzles in the puzzles folder have a commercial license attached to it. Purchase
 * a commercial license from dhtmlgoodies.com to use them.
 *
 * The 80 puzzles in the puzzles-free folder can be used freely.
 */

class SudokuReader
{

    private $cachePath;
    private $puzzlePath;
    private $startTime;

    public function __construct()
    {
        $this->startTime = microtime(true);
        if (defined("SUDOKU_PUZZLE_PATH_FREE")) {
            $this->puzzlePath = SUDOKU_PUZZLE_PATH_FREE;


        }
        if (defined("SUDOKU_CACHE_PATH_FREE")) {
            $this->cachePath = SUDOKU_CACHE_PATH_FREE;

            if(!file_exists($this->cachePath)){
                mkdir($this->cachePath, 0755);
            }
        }
    }

    public function useCommercial()
    {
        $this->puzzlePath = SUDOKU_PUZZLE_PATH;
        $this->cachePath = SUDOKU_CACHE_PATH;

        if(!file_exists($this->cachePath)){
            mkdir($this->cachePath, 0755);
        }
    }

    public function getRandomBy($level)
    {
        $count = $this->getCountPuzzles($level);
        $puzzle = rand(0, $count - 1);
        return $this->output($level, $puzzle);
    }

    private function output($level, $index)
    {
        $ret = array();
        $ret['level'] = $level;
        $ret['index'] = $index;
        $ret['puzzle'] = $this->loadPuzzle($level, $index);
        $ret['time'] = microtime(true) - $this->startTime;
        return $ret;
    }

    public function getRandom()
    {
        return $this->getRandomBy(rand(1, 8));
    }

    private function loadPuzzle($level, $index)
    {
        $cacheFile = $this->cachePath . "/puzzle_" . $level . "_" . $index . ".cache";
        if (file_exists($cacheFile)) {
            return file_get_contents($cacheFile);
        } else {
            $puzzleFile = $this->puzzlePath . "/level" . $level . ".txt";
            if (file_exists($puzzleFile)) {
                $lines = file($puzzleFile);
                $startIndex = $index * 2;
                $puzzle = $lines[$startIndex] . $lines[$startIndex + 1];

                $this->cache($level, $index, $puzzle);

                return $puzzle;
            }
        }

        return null;
    }

    private function cache($level, $index, $puzzle)
    {
        $cacheFile = $this->cachePath . "/puzzle_" . $level . "_" . $index . ".cache";
        if(!is_writable($this->cachePath))return;
        if ($fh = fopen($cacheFile, "w")) {
            fwrite($fh, $puzzle);
            fclose($fh);
        }
    }

    private function getCountPuzzles($level)
    {
        $fileCountFile = $this->cachePath . "/puzzle_count_" . $level . ".cache";



        if (file_exists($fileCountFile)) {
            return intval(file_get_contents($fileCountFile));
        } else {
            $puzzleFile = $this->puzzlePath . "/level" . $level . ".txt";
            $lines = file($puzzleFile);
            $count = count($lines) / 2;
            if (is_writeable($this->puzzlePath)) {

                $fh = fopen($fileCountFile, "w");
                fwrite($fh, $count);
                fclose($fh);
            }
            return $count;
        }
    }
}