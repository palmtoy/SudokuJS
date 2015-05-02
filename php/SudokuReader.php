<?php
/**
Author: Alf Magne Kalleland
Copyright (c) 2015, Cellar Labs AS
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

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