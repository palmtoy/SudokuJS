if(!Sudoku)Sudoku = {};

Sudoku.Storage = function(){

};

$.extends(Sudoku.Storage.prototype, {
    supported:false,
    initialize:function(){
        this.supported = typeof(Storage)!=="undefined";
    },

    save:function(key,value){
        if(!this.supported)return;
        var type = 'simple';
        if(jQuery.isPlainObject(value) || jQuery.isArray(value)){
            value = JSON.stringify(value);
            type = 'object';
        }
        localStorage[key] = value;
        localStorage[this.getTypeKey(key)] = type;
    },

    get:function(key){
        if(!this.supported)return undefined;
        var type = this.getType(key);
        if(type==='object'){
            return JSON.parse(localStorage[key]);
        }
        return localStorage[key];
    },

    getTypeKey:function(key){
        return key + '___type';
    },

    getType:function(key){
        key = this.getTypeKey(key);
        if(localStorage[key]!==undefined){
            return localStorage[key];
        }
        return 'simple';
    },

    clearLocalStore:function(){
        localStorage.clear();
    }
});
