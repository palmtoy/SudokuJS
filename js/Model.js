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
if(!Sudoku)var Sudoku = {};

Sudoku.Model = function (level, gameId, data) {
    if(level)this.setLevel(level);
    if(gameId) this.setGameId(gameId);
    if(data){
        this.populate(data);
    }else{
        this.populate("000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
    }
};

$.extend(Sudoku.Model.prototype, {

    TO_STRING_SEPARATOR: ';',
    SEPARATOR_QUICK_NOTES_INLINE: ',',

    VALID_NUMBERS: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    THICK_LINE_INDEXES: [0, 3, 6, 9],

    mGameId: 0,
    mLevel: 0,
    mLocked: false,

    SQUARES: 81,
    WIDTH: 9,
    BOX_SIZE: 3,

    activeCell: {},

    mServerCells: [],
    mSolution: [],
    mUserCells: [],
    mDigitCounts: [],
    mQuickNotes: [],
    mManualLockedSquares: [],
    mAcceptCorrectNumbersOnly: false,
    mActiveCell: undefined,

    RELATIVES: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 18, 27, 36, 45, 54, 63, 72, 10, 19, 11, 20], // 0,0
        [0, 2, 3, 4, 5, 6, 7, 8, 10, 19, 28, 37, 46, 55, 64, 73, 9, 18, 11, 20], // 1,0
        [0, 1, 3, 4, 5, 6, 7, 8, 11, 20, 29, 38, 47, 56, 65, 74, 9, 18, 10, 19], // 2,0
        [0, 1, 2, 4, 5, 6, 7, 8, 12, 21, 30, 39, 48, 57, 66, 75, 13, 22, 14, 23], // 3,0
        [0, 1, 2, 3, 5, 6, 7, 8, 13, 22, 31, 40, 49, 58, 67, 76, 12, 21, 14, 23], // 4,0
        [0, 1, 2, 3, 4, 6, 7, 8, 14, 23, 32, 41, 50, 59, 68, 77, 12, 21, 13, 22], // 5,0
        [0, 1, 2, 3, 4, 5, 7, 8, 15, 24, 33, 42, 51, 60, 69, 78, 16, 25, 17, 26], // 6,0
        [0, 1, 2, 3, 4, 5, 6, 8, 16, 25, 34, 43, 52, 61, 70, 79, 15, 24, 17, 26], // 7,0
        [0, 1, 2, 3, 4, 5, 6, 7, 17, 26, 35, 44, 53, 62, 71, 80, 15, 24, 16, 25], // 8,0
        [10, 11, 12, 13, 14, 15, 16, 17, 0, 18, 27, 36, 45, 54, 63, 72, 1, 19, 2, 20], // 0,1
        [9, 11, 12, 13, 14, 15, 16, 17, 1, 19, 28, 37, 46, 55, 64, 73, 0, 18, 2, 20], // 1,1
        [9, 10, 12, 13, 14, 15, 16, 17, 2, 20, 29, 38, 47, 56, 65, 74, 0, 18, 1, 19], // 2,1
        [9, 10, 11, 13, 14, 15, 16, 17, 3, 21, 30, 39, 48, 57, 66, 75, 4, 22, 5, 23], // 3,1
        [9, 10, 11, 12, 14, 15, 16, 17, 4, 22, 31, 40, 49, 58, 67, 76, 3, 21, 5, 23], // 4,1
        [9, 10, 11, 12, 13, 15, 16, 17, 5, 23, 32, 41, 50, 59, 68, 77, 3, 21, 4, 22], // 5,1
        [9, 10, 11, 12, 13, 14, 16, 17, 6, 24, 33, 42, 51, 60, 69, 78, 7, 25, 8, 26], // 6,1
        [9, 10, 11, 12, 13, 14, 15, 17, 7, 25, 34, 43, 52, 61, 70, 79, 6, 24, 8, 26], // 7,1
        [9, 10, 11, 12, 13, 14, 15, 16, 8, 26, 35, 44, 53, 62, 71, 80, 6, 24, 7, 25], // 8,1
        [19, 20, 21, 22, 23, 24, 25, 26, 0, 9, 27, 36, 45, 54, 63, 72, 1, 10, 2, 11], // 0,2
        [18, 20, 21, 22, 23, 24, 25, 26, 1, 10, 28, 37, 46, 55, 64, 73, 0, 9, 2, 11], // 1,2
        [18, 19, 21, 22, 23, 24, 25, 26, 2, 11, 29, 38, 47, 56, 65, 74, 0, 9, 1, 10], // 2,2
        [18, 19, 20, 22, 23, 24, 25, 26, 3, 12, 30, 39, 48, 57, 66, 75, 4, 13, 5, 14], // 3,2
        [18, 19, 20, 21, 23, 24, 25, 26, 4, 13, 31, 40, 49, 58, 67, 76, 3, 12, 5, 14], // 4,2
        [18, 19, 20, 21, 22, 24, 25, 26, 5, 14, 32, 41, 50, 59, 68, 77, 3, 12, 4, 13], // 5,2
        [18, 19, 20, 21, 22, 23, 25, 26, 6, 15, 33, 42, 51, 60, 69, 78, 7, 16, 8, 17], // 6,2
        [18, 19, 20, 21, 22, 23, 24, 26, 7, 16, 34, 43, 52, 61, 70, 79, 6, 15, 8, 17], // 7,2
        [18, 19, 20, 21, 22, 23, 24, 25, 8, 17, 35, 44, 53, 62, 71, 80, 6, 15, 7, 16], // 8,2
        [28, 29, 30, 31, 32, 33, 34, 35, 0, 9, 18, 36, 45, 54, 63, 72, 37, 46, 38, 47], // 0,3
        [27, 29, 30, 31, 32, 33, 34, 35, 1, 10, 19, 37, 46, 55, 64, 73, 36, 45, 38, 47], // 1,3
        [27, 28, 30, 31, 32, 33, 34, 35, 2, 11, 20, 38, 47, 56, 65, 74, 36, 45, 37, 46], // 2,3
        [27, 28, 29, 31, 32, 33, 34, 35, 3, 12, 21, 39, 48, 57, 66, 75, 40, 49, 41, 50], // 3,3
        [27, 28, 29, 30, 32, 33, 34, 35, 4, 13, 22, 40, 49, 58, 67, 76, 39, 48, 41, 50], // 4,3
        [27, 28, 29, 30, 31, 33, 34, 35, 5, 14, 23, 41, 50, 59, 68, 77, 39, 48, 40, 49], // 5,3
        [27, 28, 29, 30, 31, 32, 34, 35, 6, 15, 24, 42, 51, 60, 69, 78, 43, 52, 44, 53], // 6,3
        [27, 28, 29, 30, 31, 32, 33, 35, 7, 16, 25, 43, 52, 61, 70, 79, 42, 51, 44, 53], // 7,3
        [27, 28, 29, 30, 31, 32, 33, 34, 8, 17, 26, 44, 53, 62, 71, 80, 42, 51, 43, 52], // 8,3
        [37, 38, 39, 40, 41, 42, 43, 44, 0, 9, 18, 27, 45, 54, 63, 72, 28, 46, 29, 47], // 0,4
        [36, 38, 39, 40, 41, 42, 43, 44, 1, 10, 19, 28, 46, 55, 64, 73, 27, 45, 29, 47], // 1,4
        [36, 37, 39, 40, 41, 42, 43, 44, 2, 11, 20, 29, 47, 56, 65, 74, 27, 45, 28, 46], // 2,4
        [36, 37, 38, 40, 41, 42, 43, 44, 3, 12, 21, 30, 48, 57, 66, 75, 31, 49, 32, 50], // 3,4
        [36, 37, 38, 39, 41, 42, 43, 44, 4, 13, 22, 31, 49, 58, 67, 76, 30, 48, 32, 50], // 4,4
        [36, 37, 38, 39, 40, 42, 43, 44, 5, 14, 23, 32, 50, 59, 68, 77, 30, 48, 31, 49], // 5,4
        [36, 37, 38, 39, 40, 41, 43, 44, 6, 15, 24, 33, 51, 60, 69, 78, 34, 52, 35, 53], // 6,4
        [36, 37, 38, 39, 40, 41, 42, 44, 7, 16, 25, 34, 52, 61, 70, 79, 33, 51, 35, 53], // 7,4
        [36, 37, 38, 39, 40, 41, 42, 43, 8, 17, 26, 35, 53, 62, 71, 80, 33, 51, 34, 52], // 8,4
        [46, 47, 48, 49, 50, 51, 52, 53, 0, 9, 18, 27, 36, 54, 63, 72, 28, 37, 29, 38], // 0,5
        [45, 47, 48, 49, 50, 51, 52, 53, 1, 10, 19, 28, 37, 55, 64, 73, 27, 36, 29, 38], // 1,5
        [45, 46, 48, 49, 50, 51, 52, 53, 2, 11, 20, 29, 38, 56, 65, 74, 27, 36, 28, 37], // 2,5
        [45, 46, 47, 49, 50, 51, 52, 53, 3, 12, 21, 30, 39, 57, 66, 75, 31, 40, 32, 41], // 3,5
        [45, 46, 47, 48, 50, 51, 52, 53, 4, 13, 22, 31, 40, 58, 67, 76, 30, 39, 32, 41], // 4,5
        [45, 46, 47, 48, 49, 51, 52, 53, 5, 14, 23, 32, 41, 59, 68, 77, 30, 39, 31, 40], // 5,5
        [45, 46, 47, 48, 49, 50, 52, 53, 6, 15, 24, 33, 42, 60, 69, 78, 34, 43, 35, 44], // 6,5
        [45, 46, 47, 48, 49, 50, 51, 53, 7, 16, 25, 34, 43, 61, 70, 79, 33, 42, 35, 44], // 7,5
        [45, 46, 47, 48, 49, 50, 51, 52, 8, 17, 26, 35, 44, 62, 71, 80, 33, 42, 34, 43], // 8,5
        [55, 56, 57, 58, 59, 60, 61, 62, 0, 9, 18, 27, 36, 45, 63, 72, 64, 73, 65, 74], // 0,6
        [54, 56, 57, 58, 59, 60, 61, 62, 1, 10, 19, 28, 37, 46, 64, 73, 63, 72, 65, 74], // 1,6
        [54, 55, 57, 58, 59, 60, 61, 62, 2, 11, 20, 29, 38, 47, 65, 74, 63, 72, 64, 73], // 2,6
        [54, 55, 56, 58, 59, 60, 61, 62, 3, 12, 21, 30, 39, 48, 66, 75, 67, 76, 68, 77], // 3,6
        [54, 55, 56, 57, 59, 60, 61, 62, 4, 13, 22, 31, 40, 49, 67, 76, 66, 75, 68, 77], // 4,6
        [54, 55, 56, 57, 58, 60, 61, 62, 5, 14, 23, 32, 41, 50, 68, 77, 66, 75, 67, 76], // 5,6
        [54, 55, 56, 57, 58, 59, 61, 62, 6, 15, 24, 33, 42, 51, 69, 78, 70, 79, 71, 80], // 6,6
        [54, 55, 56, 57, 58, 59, 60, 62, 7, 16, 25, 34, 43, 52, 70, 79, 69, 78, 71, 80], // 7,6
        [54, 55, 56, 57, 58, 59, 60, 61, 8, 17, 26, 35, 44, 53, 71, 80, 69, 78, 70, 79], // 8,6
        [64, 65, 66, 67, 68, 69, 70, 71, 0, 9, 18, 27, 36, 45, 54, 72, 55, 73, 56, 74], // 0,7
        [63, 65, 66, 67, 68, 69, 70, 71, 1, 10, 19, 28, 37, 46, 55, 73, 54, 72, 56, 74], // 1,7
        [63, 64, 66, 67, 68, 69, 70, 71, 2, 11, 20, 29, 38, 47, 56, 74, 54, 72, 55, 73], // 2,7
        [63, 64, 65, 67, 68, 69, 70, 71, 3, 12, 21, 30, 39, 48, 57, 75, 58, 76, 59, 77], // 3,7
        [63, 64, 65, 66, 68, 69, 70, 71, 4, 13, 22, 31, 40, 49, 58, 76, 57, 75, 59, 77], // 4,7
        [63, 64, 65, 66, 67, 69, 70, 71, 5, 14, 23, 32, 41, 50, 59, 77, 57, 75, 58, 76], // 5,7
        [63, 64, 65, 66, 67, 68, 70, 71, 6, 15, 24, 33, 42, 51, 60, 78, 61, 79, 62, 80], // 6,7
        [63, 64, 65, 66, 67, 68, 69, 71, 7, 16, 25, 34, 43, 52, 61, 79, 60, 78, 62, 80], // 7,7
        [63, 64, 65, 66, 67, 68, 69, 70, 8, 17, 26, 35, 44, 53, 62, 80, 60, 78, 61, 79], // 8,7
        [73, 74, 75, 76, 77, 78, 79, 80, 0, 9, 18, 27, 36, 45, 54, 63, 55, 64, 56, 65], // 0,8
        [72, 74, 75, 76, 77, 78, 79, 80, 1, 10, 19, 28, 37, 46, 55, 64, 54, 63, 56, 65], // 1,8
        [72, 73, 75, 76, 77, 78, 79, 80, 2, 11, 20, 29, 38, 47, 56, 65, 54, 63, 55, 64], // 2,8
        [72, 73, 74, 76, 77, 78, 79, 80, 3, 12, 21, 30, 39, 48, 57, 66, 58, 67, 59, 68], // 3,8
        [72, 73, 74, 75, 77, 78, 79, 80, 4, 13, 22, 31, 40, 49, 58, 67, 57, 66, 59, 68], // 4,8
        [72, 73, 74, 75, 76, 78, 79, 80, 5, 14, 23, 32, 41, 50, 59, 68, 57, 66, 58, 67], // 5,8
        [72, 73, 74, 75, 76, 77, 79, 80, 6, 15, 24, 33, 42, 51, 60, 69, 61, 70, 62, 71], // 6,8
        [72, 73, 74, 75, 76, 77, 78, 80, 7, 16, 25, 34, 43, 52, 61, 70, 60, 69, 62, 71], // 7,8
        [72, 73, 74, 75, 76, 77, 78, 79, 8, 17, 26, 35, 44, 53, 62, 71, 60, 69, 61, 70] // 8,8
    ],

    populate: function (modelData) {
        var puzzleString = '';
        this.mQuickNotes = [];
        if (modelData.indexOf(this.TO_STRING_SEPARATOR) >= 0) {
            var tokens = modelData.split(this.TO_STRING_SEPARATOR);
            puzzleString = tokens[0];
            this.mLevel = parseInt(tokens[1]);
            this.mGameId = parseInt(tokens[2]);

            var quickNotes = tokens[3].split(this.SEPARATOR_QUICK_NOTES_INLINE);
            for (var i = 0; i < quickNotes.length; i++) {
                this.mQuickNotes[i] = quickNotes[i].split('');
            }
        } else {
            puzzleString = modelData;
        }

        puzzleString = puzzleString.replace(/[^0-9]/g,'');

        this.mServerCells = puzzleString.substring(0, this.SQUARES).split('');
        this.mSolution = puzzleString.substring(this.SQUARES, this.SQUARES * 2).split('');
        if (puzzleString.length == this.SQUARES * 3) {
            this.mUserCells = puzzleString.substring(this.SQUARES * 2).split('');
        }else{
            this.resetUserCells();
        }

        this.calculateDigitCounts();

    },

    resetUserCells:function(){
        this.mUserCells = [];
        this.mUserCells.length = this.SQUARES;
        for(var i=0;i<this.mUserCells.length;i++){
            this.mUserCells[i] = 0;
        }
    },

    restart:function(){
        this.resetUserCells();
        this.calculateDigitCounts();
        $(this).trigger("restartGame");
    },

    calculateDigitCounts: function () {
        this.mDigitCounts = [];
        var i, index;
        for (i = 0; i < this.mServerCells.length; i++) {
            index = parseInt(this.mServerCells[i]);
            if (!this.mDigitCounts[index])this.mDigitCounts[index] = 0;
            this.mDigitCounts[index]++;
        }
        for (i = 0; i < this.mUserCells.length; i++) {
            index = parseInt(this.mUserCells[i]);
            if (!this.mDigitCounts[index])this.mDigitCounts[index] = 0;
            this.mDigitCounts[index]++;
        }
    },


    setNumber: function (col, row, number) {

        if (this.isCellLocked(col, row)) return;

        var key = this.getArrayIndex(col, row);


        if (this.mAcceptCorrectNumbersOnly) {

            if (this.hasNumber(col, row)) {
                return;
            }

            if (this.getSolutionFor(col, row) != number) {
                $(this).trigger("incorrect", [col, row]);
                return;
            }
        }

        if (this.mUserCells[key] == number) {
            this.eraseNumber(col, row);
        } else {
            if (this.mUserCells[key] > 0) {
                this.mDigitCounts[this.mUserCells[key]]--;
                $(this).trigger("digitCountUpdated", this.mUserCells[key]);
            }
            this.mUserCells[key] = number;
            this.mDigitCounts[number]++;

            this.mQuickNotes[key] = [];

            $(this).trigger("quicknote", [col, row, this.mQuickNotes[key]]);

            for (var i = 0; i < this.RELATIVES[key]; i++) {
                this.removeQuickNote(this.RELATIVES[key][i], number);
            }

            $(this).trigger("setNumber", {
                x: col, y : row, number : number
            });

            $(this).trigger("digitCountUpdated", number);

            if (this.isCorrect(col, row)) {
                $(this).trigger("correct", [col, row]);
            } else {
                $(this).trigger("incorrect", [col, row]);
            }

            if(this.isSolved()) {
                $(this).trigger("solved");
            }
        }
    },

    isCorrect: function (col, row) {
        var key = this.getArrayIndex(col, row);
        return this.mSolution[key] == this.mUserCells[key];
    },

    eraseNumber:function(col, row){
        if(this.isLocked() || this.mAcceptCorrectNumbersOnly)return;
        var key = this.getArrayIndex(col, row);
        if (this.mUserCells[key]) {
            this.mDigitCounts[this.mUserCells[key]]--;
            $(this).trigger("digitCountUpdated", this.mUserCells[key]);
        }
        this.mUserCells[key] = 0;

        $(this).trigger("erase", { x : col, y : row });
    },

    getCols:function(){
        return this.WIDTH;
    },

    getRows:function(){
        return this.WIDTH;
    },

    isCellLocked:function(col, row){
        var key = this.getArrayIndex(col, row);
        return this.mManualLockedSquares[key] || this.mServerCells[key] > 0;
    },

    getDigitCount:function(digit){
        return this.mDigitCounts[digit];
    },

    getRemainingCount:function(digit){
        return this.WIDTH - this.mDigitCounts[digit];
    },

    getArrayIndex: function (col, row) {
        return (row * this.WIDTH) + col;
    },

    lockCell:function(col, row){
        this.mManualLockedSquares[this.getArrayIndex(col,row)] = true;
    },


    setGameId:function(gameId){
        this.mGameId = gameId;
    },

    getGameId:function(){
        return this.mGameId;
    },

    getLevel:function(){
        return this.mLevel;
    },

    setLevel:function(level){
        this.mLevel = level;
    },

    isCompleted:function(){
        return this.mUserCells.join('').replace(/[^1-9]/g, '').length + this.mServerCells.join('').replace(/[^1-9]/g,'').length == this.SQUARES;
    },

    isCompletedButIncorrect:function(){
        return this.isCompleted() && !this.isSolved();
    },

    toString:function(){
        var ret = '';

        ret += this.mServerCells.join('');
        ret += this.mSolution.join('');
        ret += this.mUserCells.join('');

        ret += this.TO_STRING_SEPARATOR;
        ret += this.mLevel;
        ret += this.TO_STRING_SEPARATOR;
        ret += this.mGameId;
        ret += this.TO_STRING_SEPARATOR;

        for(var i=0;i<this.mQuickNotes.length; i++){
            if(i>0)ret += this.SEPARATOR_QUICK_NOTES_INLINE;
            if(this.mQuickNotes[i]){
                ret += this.mQuickNotes[i].join('');
            }
        }

        return ret;
    },

    isSolved:function(){
        for(var i=0;i<this.mSolution.length; i++){
            if(this.mUserCells[i] != this.mSolution[i] && this.mServerCells[i] != this.mSolution[i])return false;
        }
        return true;
    },

    setQuickNote: function(col, row, number){
        if(this.isCellLocked(col, row) || this.hasNumber(col, row))return;

        var key = this.getArrayIndex(col, row);
        var index = number - 1;

        if(!this.mQuickNotes[key] || this.mQuickNotes[key].length == 0){
            this.mQuickNotes[key] = [];
            this.mQuickNotes[key].length = this.WIDTH;
            for(var i=0;i<this.WIDTH;i++){
                this.mQuickNotes[key][i] = 0;
            }
        }

        if(!parseInt(this.mQuickNotes[key][index])){
            this.mQuickNotes[key][index] = number;
        }else{
            this.mQuickNotes[key][index] = 0;
        }

        $(this).trigger("quicknote", [col, row, this.mQuickNotes[key]]);
    },

    removeQuickNotes:function(col, row){
        this.mQuickNotes[this.getArrayIndex(col, row)] = [];
    },

    removeQuickNote:function(col, row, number){
        var index = this.getArrayIndex(col, row);
        if(!this.mQuickNotes[index])return;
        this.mQuickNotes[index][number-1] = 0;
    },

    getQuickNote:function(col, row){
        var key = this.getArrayIndex(col, row);
        return this.mQuickNotes[key] ? this.mQuickNotes[key] : [];
    },

    getQuickNotes:function(){
        return this.mQuickNotes;
    },

    hasNumber:function(col, row){
        var key = this.getArrayIndex(col,row);
        return this.mUserCells[key] > 0;
    },

    getNumber:function(col, row){
        return this.mUserCells[this.getArrayIndex(col, row)];
    },

    getSolutionFor:function(col, row){
        return this.mSolution[this.getArrayIndex(col, row)];
    },

    isLocked:function(){
        return this.mLocked;
    },

    lock:function(){
        this.mLocked = true;
    },

    lockCellsWithNumbers:function(){
        this.mAcceptCorrectNumbersOnly = true;
    },

    getValidNumbers:function(){
        return this.VALID_NUMBERS;
    },

    isNumberCompleted:function(number){
        return this.getDigitCount(number) == this.WIDTH;
    },

    getCountColsInBox:function(){
        return 3;
    },

    getCountRowsInBox:function(){
        return 3;
    },

    keyToCol:function(key){
        return key % this.WIDTH;
    },

    keyToRow:function(key){
        return Math.floor(key / this.WIDTH);
    },

    getIncorrectCellOnCompleted:function(){
        if(this.isCompletedButIncorrect()){
            return this.getIncorrectCell();
        }
    },

    getIncorrectCell:function(){
        for(var i=0;i<this.mUserCells.length;i++){
            if(this.mUserCells[i] != this.mSolution[i] && this.mServerCells[i] != this.mSolution[i]){
                return {
                    x: this.keyToCol(i), y : this.keyToRow(i), key : i
                }
            }
        }
    },

    setActiveCell:function(col, row){
        this.mActiveCell = {
            x : col, y : row
        }
    },

    getActiveCell:function(){
        return this.mActiveCell;
    },

    isTopInBox:function(row){
        return row % this.BOX_SIZE == 0;
    },

    isLeftInBox:function(col) {
        return col % this.BOX_SIZE == 0;
    },

    isRightInBox:function(col) {
        return col > 0 && (col + 1) % this.BOX_SIZE == 0;
    },

    isBottomInBox:function(row) {
        return row > 0 && ((row + 1) % this.BOX_SIZE) == 0;
    },

    getThickColumns:function(){
        return this.THICK_LINE_INDEXES;
    },

    getThickRows:function(){
        return this.THICK_LINE_INDEXES;
    },

    isServerCell:function(col, row){
        var key = this.getArrayIndex(col, row);
        return this.mServerCells[key] > 0;
    },

    getServerOrUserCell:function(col, row){
        var key = this.getArrayIndex(col, row);
        return this.mUserCells.length > key && this.mUserCells[key] > 0 ? this.mUserCells[key] : this.mServerCells[key];
    },

    getServerCells:function(){
        return this.mServerCells;
    },

    getUserCell:function(col, row){
        var key = this.getArrayIndex(col, row);
        return this.mUserCells[key];
    },

    getLockedCell:function(col, row){
        return this.mServerCells[this.getArrayIndex(col, row)];
    },

    getUserCells:function(){
        return this.mUserCells;
    },

    getSolutionCells:function(){
        return this.mSolution;
    },

    getRelatives:function(col, row){
        return this.RELATIVES[this.getArrayIndex(col, row)];
    },

    toCellCoordinates:function(index){
        var ret = [];
        ret.push(this.keyToCol(index));
        ret.push(this.keyToRow(index));
        return ret;
    }

});