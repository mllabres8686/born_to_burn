console.log("class dude loaded")

class Dude {
	row = startRow
	col = startCol
	posX = 0
	posY = 0
	htmlElement = null
	listening = true
	movementTime = 100
	live
	loops
	
	constructor(id){
		this.htmlElement = $(id)
		console.log("player is set!")
	}
	
	setPosition(col, row){
		let id ="r"+row+"c"+col
		// console.log(id)
		let cell = map.getCell(id)
		let cell_offset = cell.offset()
		if(cell[0].classList.contains("free") || cell[0].classList.contains("safe") || cell[0].classList.contains("subway") ){
			this.setListening(false)
			this.col = col
			this.row = row
			this.move(cell_offset)
		}
	}
	
	move(cell_offset){
		this.htmlElement.animate(
			cell_offset,
			{
				easing: 'swing',
				duration: this.movementTime,
				complete: function(){
					this.setListening(true)
				}.bind(this)
			}
		)
		this.posX = cell_offset.top
		this.posY = cell_offset.left	
	}
	
	setListening(bool){
		this.listening = bool
		if(!this.listening){
			$("#keyboard_listener").removeClass("on")
			$("#keyboard_listener").addClass("off")
		}
		if(this.listening){
			$("#keyboard_listener").removeClass("off")
			$("#keyboard_listener").addClass("on")
		}
	}
}

