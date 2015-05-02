/**
 * Created by alfmagne1 on 02/05/15.
 */
if(!Sudoku)Sudoku = {};

Sudoku.SudokuSolvedDialog = function(config){

    if(config.renderTo != undefined)this.renderTo = $(config.renderTo); else this.renderTo = document.body;
    if(config.txtNewGame != undefined)this.txtNewGame = config.txtNewGame;
};

$.extend(Sudoku.SudokuSolvedDialog.prototype, {

    renderTo:undefined,
    el:undefined,
    txtNewGame:'New Game',
    button : undefined,

    show:function(){
        if(!this.el)this.render();
        this.el.show();
    },

    hide:function(){
        if(!this.el)return;
        this.el.hide();
    },

    render:function(){
        this.el = $('<div class="sudoku-solved-dialog" style="position:absolute;left:50%;top:50%">'
        + '<div class="sudoku-solved-heading"></div>'
        + '<Button class="sudoku-menu-button" style="position:relative;left:50%">' + this.txtNewGame + '</Button>'
        + '</div>');


        this.button = this.el.find(".sudoku-menu-button");
        this.button.on("click", function(){
            $(this).trigger("newGame");
            this.hide();
        }.bind(this));
        this.renderTo.append(this.el);


        this.position();

        this.hide();
    },

    position: function () {
        var width = this.el.width();
        var height = this.el.height();

        this.el.css("margin-left", (width / 2 * -1));
        this.el.css("margin-top", (height / 2 * -1));

        width = this.button.width();
        this.button.css("margin-left", (width / 2 * -1));
    }

});