var map = null
var map_cells = [
[[0],[0],[0],[ ],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],
[[0],[ ],[0],[ ],[0],[ ],[ ],[0],[ ],[ ],[0],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[0]],
[[0],[ ],[0],[0],[0],[0],[0],[0],[ ],[ ],[0],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[0]],
[[0],[ ],[0],[ ],[ ],[0],[ ],[0],[ ],[0],[0],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[0]],
[[0],[0],[0],[ ],[ ],[0],[ ],[0],[0],[0],[ ],[ ],[0],[0],[0],[ ],[ ],[ ],[ ],[0],[0],[0],[0],[0]],
[[0],[ ],[0],[ ],[ ],[0],[0],[0],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ]],
[[0],[ ],[0],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ]],
[[0],[0],[0],[0],[0],[0],[0],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[0],[0],[0],[0],[0]],
[[0],[ ],[ ],[0],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[0]],
[[0],[ ],[ ],[0],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[0]],
[[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[0]],
[[0],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[0],[0],[0],[0],[0]],
[[0],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[0]],
[[0],[0],[0],[0],[ ],[ ],[ ],[ ],[ ],[0],[0],[0],[0],[0],[0],[0],[0],[0],[ ],[ ],[ ],[0],[ ],[0]],
[[0],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[0],[ ],[0]],
[[0],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[0],[0],[0]],
[[0],[0],[0],[0],[0],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[ ],[0],[0],[0],[0],[0],[ ],[0]],
[[0],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[0],[0],[0],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[0],[0],[0]],
[[0],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[0],[ ],[0]],
[[0],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[0],[0],[0],[ ],[ ],[0],[0],[0],[0]],
[[0],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[0],[ ],[0],[0],[0],[0],[ ],[ ],[0]],
[[0],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[0],[ ],[ ],[0],[ ],[0],[ ],[ ],[0]],
[[0],[ ],[ ],[ ],[0],[ ],[ ],[ ],[ ],[ ],[ ],[0],[ ],[ ],[ ],[0],[ ],[ ],[0],[ ],[0],[ ],[ ],[0]],
[[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[ ],[0],[0],[0],[0]]
]
mapRows = 24
mapCols = 24

var dude = null
var startRow = 0
var startCol = 0

var dummies = []

function require(script) {
    $.ajax({
        url: script,
        dataType: "script",
        async: false,           // <-- This is the key
        success: function () {
            // all good...
        },
        error: function () {
            throw new Error("Could not load script " + script);
        }
    });
}

require('./js/test.js')
require('./js/map.js')
require('./js/dude.js')
require('./js/dummy.js')






$(document).ready(function() {
	map = new Map("#map", mapRows, mapCols)
	
	target_cell = {
		row:13,
		col:9
	}
	
	map.setTargetCell(target_cell)
	
	dude = new Dude("#dude")	
	// dude.setPosition(0,0)
	
	for(let i = 1 ; i < 12 ; i++){
		let free_cell = false
		let Y, X
		while (free_cell == false) {
			Y = Math.floor(Math.random() * (mapRows-1 - 0 + 1) + 0)
			X = Math.floor(Math.random() * (mapCols-1 - 0 + 1) + 0)
			let cell = map.getCell("r"+Y+"c"+X)
			if(cell.hasClass("free")){
				free_cell = true
			}
		}
		
		let resto
		if(i > 3){
			resto = i % 3 +1; 
		} else {
			resto = i
		}
		
		
		$("body").append("<div id='dummy_"+i+"'></div>")
		let dummy = new Dummy("#dummy_"+i)
		dummy.setAsDummy(resto)
		dummy.setPosition(X,Y)
		// dummy.setTargetCell(target_cell)
		dummies.push(dummy)
	}
});

$(document).on('keypress', async function (e) {
	let is_free = false
	let dudeRow = dude.row
	let dudeCol = dude.col
	if(dude.listening){
		
		switch(e.which){
			case 40:
			case 115:
				// console.log("down")
				if(dudeRow < mapRows-1 ) dudeRow++
				
				break;
			case 37:
			case 97:
				// console.log("left")
				if(dudeCol > 0) dudeCol--
				break;
			case 39:
			case 100:
				// console.log("right")
				if(dudeCol < mapCols-1) dudeCol++
				break;
			case 38:
			case 119:
				// console.log("up")
				if(dudeRow > 0) dudeRow--	
				break;
		}
		
		
		// let id ="r"+row+"c"+col
		// let cell_offset = map.getCell(id).offset()
		
		dude.setPosition(dudeCol,dudeRow)
	}
	
});
