<?php
/**
 * Created by PhpStorm.
 * User: Alf Magne
 * Date: 27.04.2015
 * Time: 11:07
 */

class SudokuReader {

    private $cachePath;
    private $puzzlePath;
    private $startTime;

    public function __construct(){
        $this->startTime = microtime(true);
        if(defined("SUDOKU_PUZZLE_PATH_FREE")){
            $this->puzzlePath = SUDOKU_PUZZLE_PATH_FREE;
        }
        if(defined("SUDOKU_CACHE_PATH_FREE")){
            $this->cachePath = SUDOKU_CACHE_PATH_FREE;
        }
    }

    public function useCommercial(){
        $this->puzzlePath = SUDOKU_PUZZLE_PATH;
        $this->cachePath = SUDOKU_CACHE_PATH;
    }

    public function getRandomBy($level){
        $count = $this->getCountPuzzles($level);
        $puzzle = rand(0,$count-1);
        return $this->output($level, $puzzle);
    }

    private function output($level, $index){
        $ret = array();
        $ret['level'] = $level;
        $ret['index'] = $index;
        $ret['puzzle'] = $this->loadPuzzle($level, $index);
        $ret['time'] = microtime(true) - $this->startTime;
        return  $ret;
    }

    public function getRandom(){
        return $this->getRandomBy(rand(1,8));
    }

    private function loadPuzzle($level, $index){
        $cacheFile = $this->cachePath. "/puzzle_". $level . "_". $index. ".cache";
        if(file_exists($cacheFile)){
            return file_get_contents($cacheFile);
        }else{
            $puzzleFile = $this->puzzlePath."/level".$level. ".txt";
            if(file_exists($puzzleFile)){
                $lines = file($puzzleFile);
                $startIndex = $index * 2;
                $puzzle = $lines[$startIndex].$lines[$startIndex+1];

                $this->cache($level, $index, $puzzle);

                return $puzzle;
            }
        }

        return null;
    }

    private function cache($level, $index, $puzzle){
        $cacheFile = $this->cachePath. "/puzzle_". $level . "_". $index. ".cache";
        if($fh = fopen($cacheFile, "w")){
            fwrite($fh, $puzzle);
            fclose($fh);
        }
    }

    private function getCountPuzzles($level){
        $fileCountFile = $this->cachePath . "/puzzle_count_".$level.".cache";
        if(file_exists($fileCountFile)){
            return intval(file_get_contents($fileCountFile));
        }else{
            $puzzleFile = $this->puzzlePath."/level" . $level . ".txt";
            $lines = file($puzzleFile);
            $count = count($lines) / 2;
            $fh = fopen($fileCountFile, "w");
            fwrite($fh, $count);
            fclose($fh);
            return $count;
        }
    }
}