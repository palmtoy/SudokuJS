/**
 Author: Alf Magne Kalleland
 Copyright (c) 2015, Cellar Labs AS
 All rights reserved.

 Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

 */
if(!Sudoku)Sudoku = {};

Sudoku.SolvedDialog = function(config){

    if(config.renderTo != undefined)this.renderTo = $(config.renderTo); else this.renderTo = document.body;
    if(config.txtNewGame != undefined)this.txtNewGame = config.txtNewGame;
};

$.extend(Sudoku.SolvedDialog.prototype, {

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