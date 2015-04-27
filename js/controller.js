if(!Sudoku)var Sudoku = {};

Sudoku.Controller = function(url){
    if(url != undefined)this.url = url;
};

$.extend(Sudoku.Controller.prototype, {
    url : 'sudoku-controller.php',

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
        var model = new Sudoku.Model(data.puzzle);
        model.setGameId(data.index);
        model.setLevel(data.level);

        $(this).trigger("loadmodel", model);
    }
});
