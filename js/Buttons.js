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
    buttonSizeWithSpacing: 0,

    countPerRow: undefined,
    centerX: undefined,
    minX: undefined,

    model: undefined,

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
        console.log(this.renderTo.width() + "x" + this.renderTo.height());
        this.centerX = this.renderTo.width() / 2;

        this.measure();

        this.renderTo.empty();

        var countButtons = this.getCountButtons();

        for (var i = 0; i < countButtons; i++) {
            this.renderButton(i);
        }

    },

    renderButton: function (index) {
        var x = index % this.countPerRow;
        var y = Math.floor(index / this.countPerRow);


        var left = this.minX + (x * this.buttonSizeWithSpacing);
        var top = this.buttonSizeWithSpacing * y;

        var borderRadius = this.buttonSize / 2;
        var css = 'position:absolute;left:' + left + 'px;width:' + this.buttonSize + 'px;height:' + this.buttonSize + 'px;border-radius:' + borderRadius + 'px';

        var shadow =  $('<div class="sudoku-button-shadow" style="' + css + ';top:' + (top + (this.buttonSize / 18)) + 'px;opacity:0.1"></div>');
        this.renderTo.append(shadow);
        var button = $('<div class="sudoku-button" style="' + css + ';top:' + top + 'px"></div>');
        this.renderTo.append(button);
    },

    measure: function () {
        var width = this.renderTo.width();
        var height = this.renderTo.height();
        var countButtons = this.getCountButtons();
        this.countPerRow = Math.ceil(countButtons / this.rows);
        var widthSize = (width / this.countPerRow);
        var heightSize = (height / this.rows);

        this.buttonSizeWithSpacing = heightSize > 0 ? heightSize : widthSize;
        this.buttonSize = this.buttonSizeWithSpacing - this.spacing;

        this.minX = this.centerX - (this.countPerRow / 2 * this.buttonSize) - ((this.countPerRow - 1) / 2 * this.spacing);
    },

    getCountButtons: function () {
        return 9;
    },

    setModel: function (model) {
        this.model = model;
        this.render();
    }


});