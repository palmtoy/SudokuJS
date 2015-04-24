TestCase("SudokuModelTest", {

    puzzle:
    "000103400" +
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
    "146278935",

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

    solvedPuzzle:
    "000103400" +
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
    "710400050" + // second column wrong
    "060002010" +
    "030504090" +
    "090800020" +
    "020005087" +
    "000090000" +
    "140070935",

    completedButWrong:
    "000103400" +
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
    "790400050" + // second column wrong
    "060002010" +
    "030504090" +
    "090800020" +
    "020005087" +
    "000090000" +
    "140070935",

    almostSolvedPuzzle:
    "000103400" +
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

    "test should find out when puzzle is solved": function(){
        // given
        var model = this.getSolvedModel();

        // then
        assertTrue(model.isSolved());

        // when
        var model = this.getModel();

        // then
        assertFalse(model.isSolved());
    },

    "test should parse puzzle": function(){
        // given
        var model = this.getModel();

        // then
        assertEquals(81, model.getServerCells().length);
        assertEquals(81, model.getUserCells().length);
        assertEquals(81, model.getSolutionCells().length);
    },

    "test should be able to set quick notes": function(){
        // given
        var model = this.getModel();

        // when
        model.setQuickNote(1,0,1);
        model.setQuickNote(1,0,3);
        model.setQuickNote(1,0,8);

        var quickNotes = model.getQuickNote(1,0);

        // then
        assertFalse(model.isCellLocked(1,0));
        assertFalse(model.hasNumber(1,0));
        assertEquals([1,null,3,null,null,null,null,8], quickNotes);
    },

    "test should be able to toggle quick notes": function(){
        // given
        var model = this.getModel();

        // when
        model.setQuickNote(1,2,1);
        model.setQuickNote(1,2,3);
        model.setQuickNote(1,2,8);
        model.setQuickNote(1,2,8);
        model.setQuickNote(1,2,3);
        model.setQuickNote(1,2,9);

        var quickNotes = model.getQuickNote(1,2);

        assertEquals([1,null,0,null,null,null,null,0,9], quickNotes);
    },

    "test should find wrong cell on completed": function(){

        // given
        var model = this.getCompletedButWrongModel();

        // when
        var wrong = model.getWrongCellOnCompleted();

        // then
        assertEquals(81, model.mUserCells.join('').replace(/[^1-9]/g, '').length + model.mServerCells.join('').replace(/[^1-9]/g,'').length);
        assertTrue(model.isCompleted());
        assertNotUndefined(wrong);
        assertEquals(1, wrong.x);
        assertEquals(2, wrong.y);
    },

    getModel:function(){
        return new Model(1,20,this.puzzle);
    },

    getSolvedModel:function(){
        return new Model(1,20,this.solvedPuzzle);
    },

    getCompletedButWrongModel:function(){
        return new Model(1,20, this.completedButWrong);
    }

});
