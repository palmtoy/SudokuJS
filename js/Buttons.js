if (!Sudoku)var Sudoku = {};

Sudoku.Buttons = function (config) {
    this.configure(config);
    this.render();
};

$.extend(Sudoku.Buttons.prototype, {

    renderTo: undefined,
    rows: 2,
    spacing: 10,

    buttonSize: 0,
    textSize:0,
    buttonSizeWithSpacing: 0,

    countPerRow: undefined,
    centerX: undefined,
    minX: undefined,

    model: undefined,

    buttons:[],
    digitCounts:[],

    quickNotesEnabled:true,

    configure: function (config) {
        config = config || {};
        if (config.renderTo) {
            this.renderTo = $(config.renderTo);
        } else {
            this.renderTo = document.body;
        }
        if (config.spacing)this.spacing = config.spacing;
        if (config.rows)this.rows = config.rows;
    },


    render: function () {
        if(!this.model)return;

        this.centerX = this.renderTo.width() / 2;

        this.measure();

        this.renderTo.empty();



        var numberButtons = this.model.getValidNumbers();
        this.buttons = [];
        this.digitCounts = [];
        for (var i = 0, len = numberButtons.length; i <len; i++) {
            this.renderButton(i, numberButtons[i]);
        }

        var specialButtons = this.getSpecialButtons();

        for(i=0,len = specialButtons.length; i<len; i++){
            this.renderButton(numberButtons.length + i, specialButtons[i]);
        }

    },

    renderButton: function (index, text) {
        var x = index % this.countPerRow;
        var y = Math.floor(index / this.countPerRow);


        var left = this.minX + (x * this.buttonSizeWithSpacing);
        var top = this.buttonSizeWithSpacing * y;

        var borderRadius = this.buttonSize / 2;
        var css = 'position:absolute;left:' + left + 'px;font-size:' + (this.buttonSize * 0.7) + 'px;width:' + this.buttonSize + 'px;height:' + this.buttonSize + 'px;border-radius:' + borderRadius + 'px';

        var shadow =  $('<div class="sudoku-button-shadow" style="' + css + ';top:' + (top + (this.buttonSize / 18)) + 'px;opacity:0.1"></div>');
        this.renderTo.append(shadow);
        var textOffset = this.textSize / 2 * -1;
        var button = $('<div class="sudoku-button" style="' + css + ';top:' + top + 'px"></div>');
        this.renderTo.append(button);

        if(text.length == 1){
            button.append('<div style="width:' + this.textSize + 'px;position:absolute;top:48%;left:50%;margin-left:' + textOffset + 'px;margin-top:' + textOffset + 'px">' + (index+1) + '</div>');
            var size = this.buttonSize / 5;
            var ts = this.textSize / 4;
            var offset = this.buttonSize * 0.15;
            var offsetRight = this.buttonSize * 0.2;
            var digitCount = $('<div style="position:absolute;font-size:' + ts + 'px;right:' + offsetRight + 'px;top:' + offset + 'px">' + this.model.getRemainingCount(text) + '</div>');
            button.append(digitCount);
            this.digitCounts.push(digitCount);
        }else{
            switch(text){
                case "quicknotes":
                    button.append('<img src="images/pencil.png" style="width:' + this.buttonSize + 'px;height:' + this.buttonSize + 'px">');
                    break;
                case "eraser":
                    button.append('<img src="images/eraser.png" style="width:' + this.buttonSize + 'px;height:' + this.buttonSize + 'px">');
                    break;
            }

        }


        button.on("mouseover", function(){
            button.addClass("sudoku-button-over");
        });
        button.on("mouseout", function(){
            button.removeClass("sudoku-button-over");
        });

        this.buttons.push(button);
    },

    measure: function () {
        var width = this.renderTo.width();
        var height = this.renderTo.height();
        var countButtons = this.getNumberButtons().length + this.getSpecialButtons().length;
        this.countPerRow = Math.ceil(countButtons / this.rows);
        console.log(countButtons + "," + this.countPerRow);
        var widthSize = (width / this.countPerRow);
        var heightSize = (height / this.rows);

        this.buttonSizeWithSpacing = heightSize > 0 ? heightSize : widthSize;
        this.buttonSize = this.buttonSizeWithSpacing - this.spacing;
        this.textSize = this.buttonSize * .7;

        this.minX = this.centerX - (this.countPerRow / 2 * this.buttonSize) - ((this.countPerRow - 1) / 2 * this.spacing);
    },

    getNumberButtons: function () {
        return this.model.getValidNumbers();
    },

    getSpecialButtons:function(){
        var ret = [];
        if(this.quickNotesEnabled)ret.push("quicknotes");
        ret.push("eraser");
        return ret;
    },

    setModel: function (model) {
        this.model = model;
        this.render();
    }


});