if(!Sudoku)var Sudoku = {};

Sudoku.Controller = function(config){
    config = config || {};
    if(config.commercial != undefined)this.commercial = config.commercial;
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

    commercial: false,

    load:function(level, index){

    },

    loadRandomBy:function(level){
        this.request({
            getRandom:true,
            level:level
        });
    },

    request:function(data){
        if(this.commercial){
            data.commercial = this.commercial;
        }
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
        }
        $(this.model).on("solved", function(){
            this.lockViews();
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
    }
});
