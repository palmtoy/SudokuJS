if(!Sudoku)var Sudoku = {};

Sudou.Controller = function(url){
    if(url != undefined)this.url = url;
};

$.extends(Sudoku.Controller.prototype, {
    url : undefined,

    load:function(level, index){

    },

    loadRandom:function(level){


    }
});
