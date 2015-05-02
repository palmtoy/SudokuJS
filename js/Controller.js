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

Sudoku.Controller = function(config){
    config = config || {};

    if(config.url != undefined)this.url = config.url;

    $(window).unload(function(){
        this.saveGame();
    }.bind(this));
};

$.extend(Sudoku.Controller.prototype, {
    url : 'sudoku-controller.php',

    buttonBar:undefined,
    board : undefined,
    model : undefined,
    newGameDialog:undefined,
    sudokuSolvedView:undefined,



    load:function(level, index){

    },

    loadRandomBy:function(level){
        this.request({
            getRandom:true,
            level:level
        });
    },

    request:function(data){
        $.ajax({
            dataType : 'json',
            method:'post',
            url: this.url,
            context : this,
            data:data
        }).done(function(response){
            this.onLoad(response);
        });
    },

    loadRandom:function(){
        this.request({
            getRandom:true
        });
    },

    onLoad:function(data){
        var model = new Sudoku.Model(data.level, data.index, data.puzzle);

        this.setModel(model);

        this.saveGame();
    },

    setModel:function(model){
        this.model = model;
        $(this.model).on("setNumber", function(event, data){
            if(this.board){
                this.board.setNumber(data.x, data.y, data.number);
            }
        }.bind(this));

        $(this.model).on("erase", function(event, data){
            if(this.board){
                this.board.eraseNumber(data.x, data.y);
            }
        }.bind(this));

        $(this.model).on("digitCountUpdated", function(event, digit){
            if(this.buttonBar){
                this.buttonBar.updateDigitCount(digit);
            }
        }.bind(this));

        if(this.board)this.board.setModel(model);
        if(this.buttonBar)this.buttonBar.setModel(model);

        if(this.model.isSolved()){
            this.lockViews();
        }else if(this.model.isCompletedButIncorrect()){
            if(this.board)this.board.onCompletedButIncorrect();
        }
        $(this.model).on("solved", function(){
            this.lockViews();
            $(this).trigger("solved");
            if(this.sudokuSolvedView != undefined){
                this.sudokuSolvedView.show();
            }
        }.bind(this));

        $(this.model).on("quicknote", function(event, col,row, notes){
            if(this.board)this.board.renderQuickNotes(col, row, notes);
        }.bind(this));

        $(this).trigger("loadmodel", model );
    },

    lockViews:function(){
        if(this.buttonBar)this.buttonBar.lock();
        if(this.board)this.board.lock();
    },

    setButtonBar:function(buttonBar){
        this.buttonBar = buttonBar;

        $(this.buttonBar).on("numberClicked", function(event, digit){
            if(this.board){
                this.board.highlight(digit);
            }
        }.bind(this));
    },

    setNewGameDialog:function(dialog){
        this.newGameDialog = dialog;

        $(this.newGameDialog).on("startGame", function(event, level){
            this.loadRandomBy(level);
        }.bind(this));
    },

    setSudokuSolvedView:function(view){
        this.sudokuSolvedView = view;

        $(this.sudokuSolvedView).on("newGame", function(event){
            if(this.newGameDialog)this.newGameDialog.show();
        }.bind(this));
    },

    setBoard:function(board){
        this.board = board;

        $(this.board).on("click", function(event, pos){
            if(this.buttonBar){
                var num = this.buttonBar.getNumber();

                if(this.buttonBar.isInEraseMode()){
                    this.model.eraseNumber(pos.x, pos.y);
                }else if(this.buttonBar.isInQuickNotesMode() && num){
                    this.model.setQuickNote(pos.x, pos.y, num);
                }else if(num){
                    this.model.setNumber(pos.x, pos.y, num);
                }
            }
        }.bind(this));
    },

    getModel:function(){
        return this.model;
    },

    resume:function(){
        if(this.hasGameToResume()){
            var game = localStorage["sudokuToResume"];
            var model = new Sudoku.Model();
            model.populate(game);
            this.setModel(model);
        }
    },

    clearGameToResume:function(){
        if(typeof(Storage)=="undefined")return;
        localStorage.clear();
    },

    saveGame:function(){
        if(typeof(Storage)=="undefined")return;
        localStorage["sudokuToResume"] = this.model.toString();
    },

    hasGameToResume:function(){
        if(typeof(Storage)=="undefined")return false;
        return localStorage["sudokuToResume"] ? true: false;
    },

    showEmptyBoard:function(){
        var model = new Sudoku.Model();
        this.setModel(model);
        model.lock();
        if(this.buttonBar)this.buttonBar.lock();
    }
});
