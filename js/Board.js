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

if (!Sudoku)var Sudoku = {};

Sudoku.Board = function (config) {
    this.configure(config);
};

$.extend(Sudoku.Board.prototype, {

    renderTo: undefined,
    model: undefined,
    boardSize: undefined,
    borderSize: undefined,
    borderSizeThin: undefined,

    squareSize: undefined,
    squareHighlightSize: undefined,
    squareHighlightRadius: undefined,
    textSize: undefined,
    quickNotesTextSize:undefined,
    quickNotesCellWidth:undefined,

    board: undefined,

    borderRadius: 0,

    squares: [],
    highlights: [],
    highlightsGrid: [],
    quickNotes:[],

    numbers: [],

    size: undefined,

    activeDigit: undefined,

    currentlyHighlighted:[],

    container : undefined,

    highlightedIncorrect: undefined,

    locked : false,

    configure: function (config) {
        if (config.renderTo) {
            this.renderTo = $(config.renderTo);
        } else {
            this.renderTo = document.body;
        }
    },

    render: function () {
        if (!this.model)return;

        this.locked = false;

        this.highlightedIncorrect = undefined;

        this.measure();

        this.currentlyHighlighted = [];

        this.size = this.model.getValidNumbers().length;

        if(!this.container) {
            this.container = $('<div style="position:relative;width:' + this.boardSize + 'px;height:' + this.boardSize + 'px"></div>');
            this.renderTo.append(this.container);
        }
        this.container.empty();

        this.board = $('<div class="sudoku-board" style="position:absolute;width:' + this.boardSize + 'px;height:' + this.boardSize + 'px">');

        this.container.append(this.board);

        this.renderBackgroundColors();
        this.renderLines();
        this.renderFrame();
        this.renderSquares();



    },

    renderBackgroundColors:function(){
        var cols = this.model.getCountColsInBox();
        var rows = this.model.getCountRowsInBox();

        var width = this.model.getCountColsInBox() * this.squareSize;
        var height = this.model.getCountRowsInBox() * this.squareSize;

        var size = this.model.getValidNumbers().length;

        for(var i=0;i<size;i+=cols){
            for(var j=0;j<size; j+= rows){
                var cls = (i+j) % 2 == 0 ? "sudoku-board-grid-color-one" : "sudoku-board-grid-color-two";
                var x = i * this.squareSize;
                var y = j * this.squareSize;

                this.board.append($('<div class="' + cls + '" style="position:absolute;width:' + width + 'px;height:' + height + 'px;top:' + y + 'px;left:' + x + 'px"></div>'));
            }
        }
    },

    renderSquares: function () {

        this.numbers = [];
        this.squares = [];
        this.highlights = [];
        this.quickNotes = [];
        this.highlightsGrid = [];
        this.highlights.length = this.model.getValidNumbers().length + 1;


        for (var col = 0; col < this.size; col++) {
            this.squares[col] = [];
            this.numbers[col] = [];
            this.quickNotes[col] = [];
            this.highlightsGrid[col] = [];

            for (var row = 0; row < this.size; row++) {
                this.renderSquare(col, row);
                this.renderQuickNotes(col, row);
            }
        }
    },

    highlight: function (digit) {

        if(this.currentlyHighlighted.length > 0){
            for(var i=0;i<this.currentlyHighlighted.length; i++){
                this.currentlyHighlighted[i].css("display", "none");
            }
        }

        this.currentlyHighlighted = [];
        if (this.highlights[digit]) {
            for (i = 0, len = this.highlights[digit].length; i < len; i++) {
                this.currentlyHighlighted.push(this.highlights[digit][i]);
                this.highlights[digit][i].css("display", "");
            }
        }

        this.activeDigit = digit;
    },

    renderSquare: function (col, row) {

        var digit = parseInt(this.model.getServerOrUserCell(col, row));
        this.numbers[col].push(digit);

        var x = this.squareSize * col;
        var y = this.squareSize * row;


        var offsetTop = (this.squareSize - this.squareHighlightSize) / 2;
        var offsetLeft = (this.squareSize - this.squareHighlightSize) / 2;

        var highlight = $('<div class="sudoku-square-highlight" style="display:none;position:absolute;border-radius:' + this.squareHighlightRadius + 'px;left:' + (x + offsetLeft) + 'px;top:' + (y + offsetTop) + 'px;width:' + this.squareHighlightSize + 'px;height:' + this.squareHighlightSize + 'px"></div>');
        if (!this.highlights[digit]) {
            this.highlights[digit] = [];
        }
        this.highlights[digit].push(highlight);
        this.highlightsGrid[col].push(highlight);

        this.board.append(highlight);

        var quickNote = $('<div class="sudoku-quicknotes-container" style="position:absolute;line-height:' + (this.squareSize / this.model.BOX_SIZE) + 'px;font-size:' + this.quickNotesTextSize + 'px;left:' + x + 'px;top:' + y + 'px;width:' + (this.squareSize - this.borderSizeThin) + 'px;height:' + this.squareSize + 'px"></div>');
        this.board.append(quickNote);
        this.quickNotes[col].push(quickNote);


        var el = $('<div class="sudoku-square-number" style="line-height:' + this.squareSize + 'px;font-size:' + this.textSize + 'px;left:' + x + 'px;top:' + y + 'px;width:' + this.squareSize + 'px;height:' + this.squareSize + 'px"></div>');

        if(this.model.isServerCell(col, row)){
            el.addClass("sudoku-square-locked");
        }else{
            el.addClass("sudoku-square-open");
        }

        if (digit) {
            el.text(digit);
        }

        this.squares[col].push(el);

        el.on("click", function () {
            this.clickCell(col, row);
        }.bind(this));

        this.board.append(el);


    },

    renderLines: function () {
        this.renderHorizontalLines();
        this.renderVerticalLines();
    },

    renderHorizontalLines: function () {
        for (var i = 0; i < this.size - 1; i++) {
            var borderSize = this.model.isBottomInBox(i) ? this.borderSize : this.borderSizeThin;
            var top = this.squareSize * (i + 1) - (borderSize / 2);
            var width = this.boardSize - borderSize;
            var el = $('<div class="sudoku-line" style="position:absolute;left:0;width:' + width + 'px;top:' + top + 'px;height:' + borderSize + 'px"></div>');
            this.board.append(el);

        }
    },

    renderVerticalLines: function () {
        var width = this.boardSize - this.borderSize;
        for (var i = 0; i < this.size - 1; i++) {
            var borderSize = this.model.isRightInBox(i) ? this.borderSize : this.borderSizeThin;
            var left = this.squareSize * (i + 1) - (borderSize / 2);
            var el = $('<div class="sudoku-line" style="position:absolute;left:0;height:' + width + 'px;left:' + left + 'px;width:' + borderSize + 'px"></div>');
            this.board.append(el);
        }
    },

    clickCell: function (col, row) {
        if (!this.model.isCellLocked(col, row)) {
            $(this).trigger("click", {x: col, y: row});
        }
    },

    renderQuickNotes:function(col, row){
        var quickNotes = this.model.getQuickNote(col, row);

        this.quickNotes[col][row].empty();

        if(this.model.hasNumber(col, row) || this.model.isCellLocked(col, row))return;

        var content = '';
        for(var i=0;i<this.size;i++){
            var num = parseInt(quickNotes[i]);
            num = num ? num : '';
            content += '<div class="sudoku-quicknotes-cell" style="width:' + this.quickNotesCellWidth + '%;height:' + this.quickNotesCellWidth + '%;">' + num + '</div>';
        }

        this.quickNotes[col][row].append(content);

    },

    setNumber: function (col, row, number) {

        if(this.locked) return;

        if (this.numbers[col][row]) {
            this.eraseNumber(col, row);
        }
        var highlight = this.highlightsGrid[col][row];
        this.highlights[number].push(highlight);

        this.squares[col][row].text(number);
        this.numbers[col][row] = number;

        this.highlight(number);

        this.clearIncorrect();

        this.onCompletedButIncorrect();

    },

    onCompletedButIncorrect:function(){
        if(this.model.isCompletedButIncorrect()){

            this.board.effect("shake", { times: 1 }, "slow");

            var pos = this.model.getIncorrectCellOnCompleted();
            if(pos){
                var cell = this.squares[pos.x][pos.y];
                cell.addClass("sudoku-square-incorrect");
                this.highlightedIncorrect = cell;
            }
        }
    },

    eraseNumber: function (col, row) {
        this.squares[col][row].text("");

        var n = this.numbers[col][row];
        var h = this.highlightsGrid[col][row];

        var index = this.highlights[n].indexOf(h);
        if(index >= 0){
            this.highlights[n].splice(index, 1);
        }

        this.numbers[col][row] = 0;

        if(this.activeDigit){
            this.highlight(this.activeDigit);
        }

        this.clearIncorrect();


    },

    clearIncorrect:function(){
        if(this.highlightedIncorrect){
            this.highlightedIncorrect.removeClass("sudoku-square-incorrect");
        }
    },

    renderFrame: function () {
        var size = this.boardSize - (this.borderSize * 2);
        this.board.append('<div class="sudoku-board-frame" style="border-style:solid;border-width:' + this.borderSize + 'px;border-radius:' + this.borderRadius + 'px;width:' + size + 'px;height:' + size + 'px"></div>');
    },

    measure: function () {
        var width = this.renderTo.width();
        var height = this.renderTo.height();

        this.boardSize = Math.max(width, height);
        this.squareSize = this.boardSize / this.model.getValidNumbers().length;
        this.squareHighlightSize = this.squareSize * 0.8;
        this.squareHighlightRadius = this.squareHighlightSize / 2;
        this.textSize = this.squareSize * 0.6;
        this.quickNotesTextSize = this.textSize / 3;

        this.borderSize = Math.round(this.squareSize / 15);
        this.borderSizeThin = Math.round(this.squareSize / 30);
        this.borderRadius = this.squareSize / 7;

        this.quickNotesCellWidth = 100 / this.model.BOX_SIZE;

    },

    setModel: function (model) {
        this.model = model;
        $(model).on("restartGame", this.render.bind(this));
        this.render();
    },

    lock:function(){
        this.locked = true;
    }

});