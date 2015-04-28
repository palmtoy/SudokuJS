/**
 * Created by Alf Magne on 28.04.2015.
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

    board: undefined,

    borderRadius: 0,

    squares: [],
    highlights: [],
    highlightsGrid: [],

    numbers: [],

    size: undefined,

    activeDigit: undefined,

    currentlyHighlighted:[],

    configure: function (config) {
        if (config.renderTo) {
            this.renderTo = $(config.renderTo);
        } else {
            this.renderTo = document.body;
        }
    },

    render: function () {
        this.renderTo.empty();

        if (!this.model)return;

        this.measure();

        this.currentlyHighlighted = [];

        this.size = this.model.getValidNumbers().length;

        this.board = $('<div class="sudoku-board" style="width:' + this.boardSize + 'px;height:' + this.boardSize + 'px">');

        this.renderTo.append(this.board);


        this.renderLines();
        this.renderFrame();
        this.renderSquares();


    },

    renderSquares: function () {

        this.numbers = [];
        this.squares = [];
        this.highlights = [];
        this.highlightsGrid = [];
        this.highlights.length = this.model.getValidNumbers().length + 1;


        for (var col = 0; col < this.size; col++) {
            this.squares[col] = [];
            this.numbers[col] = [];
            this.highlightsGrid[col] = [];

            for (var row = 0; row < this.size; row++) {
                this.renderSquare(col, row);
            }
        }
    },

    clearHighlights:function(){
        if (this.activeDigit && this.activeDigit && this.highlights[this.activeDigit]) {
            for (var i = 0, len = this.highlights[this.activeDigit].length; i < len; i++) {
                this.highlights[this.activeDigit][i].css("display", "none");
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


        offsetTop = (this.squareSize - this.textSize) / 2;
        offsetLeft = (this.squareSize - this.textSize) / 2;


        var el = $('<div class="sudoku-square-number" style="font-size:' + this.textSize + 'px;left:' + (x + offsetLeft) + 'px;top:' + (y + offsetTop) + 'px;width:' + (this.squareSize - (offsetLeft * 2)) + 'px;height:' + (this.squareSize - (offsetTop * 2)) + 'px"></div>');

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

    setNumber: function (col, row, number) {
        if (this.numbers[col][row]) {
            this.eraseNumber(col, row);
        }
        var highlight = this.highlightsGrid[col][row];
        this.highlights[number].push(highlight);
        console.log(col + ", " + row + ", " + number);
        this.squares[col][row].text(number);
        this.numbers[col][row] = number;

        this.highlight(number);
    },


    eraseNumber: function (col, row) {
        this.squares[col][row].text("");

        var n = this.numbers[col][row];
        var h = this.highlightsGrid[col][row];

        console.log(this.highlights[n].length);


        var index = this.highlights[n].indexOf(h);
        if(index >= 0){
            this.highlights[n].splice(index, 1);
        }

        console.log(this.highlights[n].length);

        this.numbers[col][row] = 0;

        if(this.activeDigit){
            this.highlight(this.activeDigit);
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
        this.borderSize = this.squareSize / 15;
        this.borderSizeThin = this.squareSize / 30;
        this.borderRadius = this.squareSize / 10;


    },

    setModel: function (model) {
        this.model = model;
        this.render();
    }

});