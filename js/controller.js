if(!Sudoku)var Sudoku = {};

Sudoku.Controller = function(url){
    if(url != undefined)this.url = url;
};

$.extend(Sudoku.Controller.prototype, {
    url : 'sudoku-controller.php',

    buttonBar:undefined,
    board : undefined,
    model : undefined,

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

        $(this).trigger("loadmodel", model );
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
    }
});
