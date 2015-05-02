/**
 Author: Alf Magne Kalleland
 Copyright 2015 Cellar Labs AS

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

Sudoku.NewGameDialog = function (config) {

    if (config.renderTo != undefined)this.renderTo = $(config.renderTo); else this.renderTo = document.body;
    if (config.difficulties != undefined)this.difficulties = config.difficulties;
    if (config.txtHeading != undefined)this.txtHeading = config.txtHeading;
    if (config.difficulty != undefined)this.difficulty = config.difficulty;

};

$.extend(Sudoku.NewGameDialog.prototype, {

    renderTo: undefined,
    el: undefined,
    txtHeading: 'New Game',
    btnTextStartGame: 'Start Game',
    btnTextCancel: 'Cancel',
    difficulty: 1,

    difficulties: [
        'Very easy', 'Easy', 'Easy', 'Moderate', 'Moderate', 'Hard', 'Very Hard', 'Extreme'
    ],

    elDifficulty: undefined,
    elSlider:undefined,

    render: function () {

        this.el = $('<div class="sudoku-dialog new-game-dialog" style="position:absolute;left:50%;top:50%">'
        + '<div class="sudoku-new-game-heading">' + this.txtHeading + '</div>'
        + '<div class="sudoku-difficulty-label">' + this.difficulties[this.difficulty - 1] + '</div>'
        + '<div class="sudoku-new-game-slider"></div>'
        + '<div><button id="s-new-game-start" class="sudoku-menu-button sudoku-menu-button-light">' + this.btnTextStartGame + '</button>'
        + '<button id="s-new-game-cancel" class="sudoku-menu-button sudoku-menu-button-light">' + this.btnTextCancel + '</button></div>'
        + '</div>');

        this.renderTo.append(this.el);

        this.el.find(".sudoku-new-game-slider").slider({
            min: 1, max: 8,
            slide:function(event, ui){
                this.updateLabel(ui.value);
            }.bind(this),
            change:function(event, ui){
                this.updateLabel(ui.value);
            }.bind(this)
        });

        this.el.find("#s-new-game-start").on("click", function(){
            $(this).trigger("startGame", this.difficulty);
            this.hide();
        }.bind(this));

        this.el.find('#s-new-game-cancel').on("click", function(){
            this.el.hide();
        }.bind(this));

        this.elDifficulty = this.el.find(".sudoku-difficulty-label");

        this.position();
        this.updateLabel(this.difficulty);
        this.hide();
    },

    show:function(){
        if(!this.el)this.render();
        this.el.show();
    },

    hide:function(){
        this.el.hide();
    },

    updateLabel:function(value){
        this.difficulty = value;
        this.elDifficulty.text('L' + value + ' - ' + this.difficulties[value-1]);
    },

    position: function () {
        var width = this.el.width();
        var height = this.el.height();

        this.el.css("margin-left", (width / 2 * -1));
        this.el.css("margin-top", (height / 2 * -1));
    }

});