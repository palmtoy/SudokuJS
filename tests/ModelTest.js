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
    "710400050" + // second column Incorrect
    "060002010" +
    "030504090" +
    "090800020" +
    "020005087" +
    "000090000" +
    "140070935",

    completedButIncorrect:
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
    "790400050" + // second column Incorrect
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
        var model = new Sudoku.Model(1, 20, false);

        // then
        assertEquals(20, model.getGameId());
    },


    "test should get solution": function () {
        // given
        var model = new Sudoku.Model(1, 20, this.puzzle);

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

    "test should fire event on Incorrect cells": function(){
        // given
        var model = this.getModel();
        var triggered = false;
        // when
        $(model).on("incorrect", function(){
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


    "test should be able to remove quick notes": function(){
        // given
        var model = this.getModel();
        model.setQuickNote(1,0,1);
        model.setQuickNote(1,0,3);
        model.setQuickNote(1,0,8);

        // when
        model.removeQuickNotes(1,0);

        // then
        assertEquals([], model.getQuickNote(1,0));

    },


    "test should find Incorrect cell on completed": function(){

        // given
        var model = this.getCompletedButIncorrectModel();

        // when
        var Incorrect = model.getIncorrectCellOnCompleted();

        // then
        assertEquals(81, model.mUserCells.join('').replace(/[^1-9]/g, '').length + model.mServerCells.join('').replace(/[^1-9]/g,'').length);
        assertTrue(model.isCompleted());
        assertNotUndefined(Incorrect);
        assertEquals(1, Incorrect.x);
        assertEquals(2, Incorrect.y);
    },

    "test should be able to convert from toString to new object": function(){

        // given
        var model = this.getCompletedButIncorrectModel();

        // when
        var modelString = model.toString();
        var model2 = new Sudoku.Model(0,0, modelString);

        // then
        assertEquals(1, model2.getLevel());
        assertEquals(20, model2.getGameId());
        assertEquals(model.getServerCells(), model2.getServerCells());
        assertEquals(model.getSolutionCells(), model2.getSolutionCells());
        assertEquals(model.getUserCells(), model2.getUserCells());
    },

    "test should be able to erase number": function(){
        // given
        var model = this.getModel();

        // when
        model.setNumber(1,0,2);
        assertEquals(2, model.getNumber(1,0));
        model.eraseNumber(1,0);

        assertEquals(0, model.getNumber(1,0));

    },

    "test should find completed numbers": function(){
        // given
        var model = this.getModel();

        // then
        assertFalse(model.isNumberCompleted(1));
        assertFalse(model.isNumberCompleted(2));
        assertFalse(model.isNumberCompleted(3));
        assertFalse(model.isNumberCompleted(4));
        assertFalse(model.isNumberCompleted(5));
        assertFalse(model.isNumberCompleted(6));
        assertFalse(model.isNumberCompleted(7));
        assertFalse(model.isNumberCompleted(8));
        assertFalse(model.isNumberCompleted(9));

        // given
        model = this.getSolvedModel();
        // then
        assertTrue(model.isNumberCompleted(1));
        assertTrue(model.isNumberCompleted(2));
        assertTrue(model.isNumberCompleted(3));
        assertTrue(model.isNumberCompleted(4));
        assertTrue(model.isNumberCompleted(5));
        assertTrue(model.isNumberCompleted(6));
        assertTrue(model.isNumberCompleted(7));
        assertTrue(model.isNumberCompleted(8));
        assertTrue(model.isNumberCompleted(9));
    },

    "test should get digit count": function(){
        // given
        var model = this.getModel();

        // then
        assertEquals(4, model.getDigitCount(5));

        // when
        model.setNumber(1,0, 5);

        // then
        assertEquals(5, model.getDigitCount(5));

        model.setNumber(1,0, 5);
        assertEquals(4, model.getDigitCount(5));


        model.setNumber(1,0, 5);
        assertEquals(5, model.getDigitCount(5));

        model.eraseNumber(1,0);
        assertEquals(4, model.getDigitCount(5));
    },

    "test should get valid numbers": function(){
        // given
        var model = this.getModel();

        // then
        assertEquals([1,2,3,4,5,6,7,8,9], model.getValidNumbers());
    },

    "test should find incorrect cells": function(){
        // given
        var model = this.getModel();

        // when
        model.setNumber(0,0,'6');
        model.setNumber(1,0,'7'); // incorrect, correct is 8

        var pos = model.getIncorrectCell();

        // then
        assertFalse(model.isCellLocked(1,0));
        assertEquals(8, model.getSolutionFor(1,0));
        assertEquals(7, model.getUserCell(1,0));
        assertEquals(1, pos.x);
        assertEquals(0, pos.y);

    },

    "test should find solved": function(){
        // given
        var model = this.getModel();

        var solution =
                ["682153479",
                "354789261",
                "719426853",
                "867932514",
                "231564798",
                "495817326",
                "923645187",
                "578391642",
                "146278935"]

        for(var row = 0;row < solution.length; row++){
            for(var col = 0; col < solution[row].length; col++){
                var digit = solution[row].charAt(col);
                model.setNumber(col, row, parseInt(digit));
            }
        }

        // then
        assertFalse(model.isCompletedButIncorrect());
        assertTrue(model.isSolved());
    },

    getModel:function(){
        return new Sudoku.Model(1,20,this.puzzle);
    },

    getSolvedModel:function(){
        return new Sudoku.Model(1,20,this.solvedPuzzle);
    },

    getCompletedButIncorrectModel:function(){
        return new Sudoku.Model(1,20, this.completedButIncorrect);
    }

});
