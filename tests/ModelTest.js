TestCase("SudokuModelTest", {

    puzzle: "000103400" +
    "354709261" +
    "009026803" +
    "807930504" +
    "201060708" +
    "405017306" +
    "903640100" +
    "578301642" +
    "006208000" +
    "682153479354789261719426853867932514231564798495817326923645187578391642146278935",

    puzzleWithUserCells: "000103400" +
    "354709261" +
    "009026803" +
    "807930504" +
    "201060708" +
    "405017306" +
    "903640100" +
    "578301642" +
    "006208000" +
        // Solution
    "682153479" +
    "354789261" +
    "719426853" +
    "867932514" +
    "231564798" +
    "495817326" +
    "923645187" +
    "578391642" +
    "146278935" +
        // Entered cells
    "120000000" +
    "000000000" +
    "000000000" +
    "000000000" +
    "000000000" +
    "000000000" +
    "000000000" +
    "000000000" +
    "000000003",

    solvedPuzzle: "000103400" +
    "354709261" +
    "009026803" +
    "807930504" +
    "201060708" +
    "405017306" +
    "903640100" +
    "578301642" +
    "006208000" +
        // Solution
    "682153479" +
    "354789261" +
    "719426853" +
    "867932514" +
    "231564798" +
    "495817326" +
    "923645187" +
    "578391642" +
    "146278935" +
        // Entered cells
    "682050079" +
    "000080000" +
    "719426853" +
    "867932514" +
    "231564798" +
    "495817326" +
    "923645187" +
    "578391642" +
    "146278935",

    "test should set game id": function () {
        var model = new Model(1, 20, false);

        // then
        assertEquals(20, model.getGameId());
    },


    "test should get solution": function () {
        // given
        var model = new Model(1, 20, this.puzzle);

        // then
        assertEquals(3, model.getSolutionFor(0,1));
    },

    "test should be able to set number": function(){
        // given
        var model = this.getModel();

        // when
        model.setNumber(2,0,2);

        // then
        assertEquals(2, model.getNumber(2,0));
    },

    "test should find edges": function(){
        var model = this.getModel();

        assertTrue(model.isTopInBox(3));
        assertFalse(model.isTopInBox(2));

        assertTrue(model.isLeftInBox(6));
        assertFalse(model.isLeftInBox(4));

        assertTrue(model.isRightInBox(5));
        assertFalse(model.isRightInBox(6));

        assertTrue(model.isBottomInBox(8));
        assertFalse(model.isBottomInBox(3));
    },

    "test should find server cells": function(){

        var model = this.getModel();

        // then
        assertFalse(model.isServerCell(0,0));
        assertTrue(model.isServerCell(0,1));
        assertTrue(model.isServerCell(1,1));
        assertTrue(model.isServerCell(2,1));
    },

    "test should fire event on correct cells": function(){
        // given
        var model = this.getModel();
        var triggered = false;
        // when
        $(model).on("correct", function(){
            triggered = true;
        });
        model.setNumber(1,0,8);

        // then
        assertTrue(triggered);

    },

    "test should fire event on wrong cells": function(){
        // given
        var model = this.getModel();
        var triggered = false;
        // when
        $(model).on("wrong", function(){
            triggered = true;
        });
        model.setNumber(1,0,4);

        // then
        assertTrue(triggered);
    },

    getModel:function(){
        return new Model(1,20,this.puzzle);
    }

});
