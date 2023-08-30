console.log("class police loaded")

class Police {
	"use strict"
	id = null
	row = 0
	col = 0
	posX = 0
	posY = 0
	htmlElement = null
	movementTime = 50
	life = false
	loops = 0
	max_life = 0
	last_dir = null
	target_cell = null
	direction = null
	lights = null
	self = this
	
	
	constructor(num, col, row){
		this.htmlElement = $("#police_" + num)
		this.htmlElement.addClass("police")
		
		
		this.id = "#police_" + num
		
		this.lights = $("#police_lights_"+num)
		
		this.col = col
		this.row = row
		let cell_id ="r"+row+"c"+col
		let cell_offset = map.getCell(cell_id).offset()
		this.posX = cell_offset.top
		this.posY = cell_offset.left
		this.htmlElement.offset(cell_offset)
		
		// this.movementTime = Math.floor(Math.random() * (300 - 150 + 1) + 150)
		this.movementTime = Math.floor(Math.random() * (600 - 400 + 1) + 400)
		
		// setTimeout(this.live.bind(this), 555500)
	}
	
	
	
	setPosition(col, row){
		this.col = col
		this.row = row
		let id ="r"+row+"c"+col
		let cell_offset = map.getCell(id).offset()
		
		this.move(cell_offset)
	}
	
	move(cell_offset){
		this.htmlElement.animate(cell_offset, this.movementTime)
		this.posX = cell_offset.top
		this.posY = cell_offset.left
	}
	

	live(){
		// let m = this
		this.lightsOn()
		this.life = window.setInterval(function() {
			this.loops++
			
			let dude_cell = {
				row:dude.row,
				col:dude.col
			}
			map.setTargetCell(dude_cell)
			this.smartMove()
			// this.randomMove()

			

		}.bind(this), this.movementTime +100)
	}
	
	randomMove(){
		let row,col
		col = this.col
		row = this.row
		let avaiable_dirs = this.getAvailableCells(col, row)
		
		if(avaiable_dirs.length > 1){
			if(this.last_dir == 1){
				const index = avaiable_dirs.indexOf(4);
				if (index > -1) {
				  avaiable_dirs.splice(index, 1);
				}
			}
			if(this.last_dir == 4){
				const index = avaiable_dirs.indexOf(1);
				if (index > -1) {
				  avaiable_dirs.splice(index, 1);
				}
			}
			if(this.last_dir == 2){
				const index = avaiable_dirs.indexOf(3);
				if (index > -1) {
				  avaiable_dirs.splice(index, 1);
				}
			}
			if(this.last_dir == 3){
				const index = avaiable_dirs.indexOf(2);
				if (index > -1) {
				  avaiable_dirs.splice(index, 1);
				}
			}
		}
		
		
		
		let dir = avaiable_dirs[Math.floor(Math.random()*avaiable_dirs.length)];		
		this.last_dir = dir
		
		this.autoMove(dir)
	}
	
	autoMove(dir){
		let row,col
		col = this.col
		row = this.row
		
		switch(dir){
		case 1:
			if(this.col < mapCols-1){
				col++
			}
			break;
		
		case 2:
			if(this.row > 0){
				row--
			}
			break;
		
		case 3:
			if(this.row < mapRows-1){
				row++
			}
			break;
		
		case 4:
			if(this.col > 0){
				col--
			}				
			break;
			
		}
		this.setPosition(col,row)
	}
	
	getAvailableCells(col, row){
		let avaiable_dirs = []
		//comprueba las celdas adyacentes y propone las que estan libres commo posibles direcciones
		let right_cell = null
		let left_cell = null
		let top_cell = null
		let bottom_cell = null
		
		if(col<mapCols-1){
			right_cell = map.getCell("r"+row+"c"+(col+1))
			if(right_cell.hasClass("free")){
				avaiable_dirs.push(1)
			}
		}
		
		if(col>0){
			left_cell = map.getCell("r"+row+"c"+(col-1))
			if(left_cell.hasClass("free")){
				avaiable_dirs.push(4)
			}
		}
		
		if(row>0){
			top_cell = map.getCell("r"+(row-1)+"c"+col)
			if(top_cell.hasClass("free")){
				avaiable_dirs.push(2)
			}
		}
		
		if(row<mapRows-1){
			bottom_cell = map.getCell("r"+(row+1)+"c"+col)
			if(bottom_cell != undefined){
				if(bottom_cell.hasClass("free")){
					avaiable_dirs.push(3)
				}
			}
			
		}
		return avaiable_dirs
	}
	
	smartMove(){
		let row,col
		col = this.col
		row = this.row
		let recomended_dirs = []
		let avaiable_dirs = []
		let dir = null
		let recomended = false
		let current_cell = null	
		
		//las celdas adyacentes no ocupadas
		avaiable_dirs = this.getAvailableCells(col, row)
		
		//celda actual
		current_cell = map.getCell("r"+row+"c"+col)
		
		//evita que dentro de una recta no vaya para atras
		//eliminando la opcion de las posible direcciones
		if(avaiable_dirs.length > 1){
			if(this.last_dir == 1){
				const index = avaiable_dirs.indexOf(4);
				if (index > -1) {
				  avaiable_dirs.splice(index, 1);
				}
			}
			if(this.last_dir == 4){
				const index = avaiable_dirs.indexOf(1);
				if (index > -1) {
				  avaiable_dirs.splice(index, 1);
				}
			}
			if(this.last_dir == 2){
				const index = avaiable_dirs.indexOf(3);
				if (index > -1) {
				  avaiable_dirs.splice(index, 1);
				}
			}
			if(this.last_dir == 3){
				const index = avaiable_dirs.indexOf(2);
				if (index > -1) {
				  avaiable_dirs.splice(index, 1);
				}
			}
		}
		
		//direcciones recomendadas segun el target
		if(col < map.target_cell.col){
			recomended_dirs.push(1)
		}	
		if(col > map.target_cell.col){
			recomended_dirs.push(4)
		}	
		if(row < map.target_cell.row){
			recomended_dirs.push(3)
		}
		if(row > map.target_cell.row){
			recomended_dirs.push(2)
		}
		
		recomended_dirs.sort()
		
		
		for(let i = 0 ; i < recomended_dirs.length ; i++){
			if(avaiable_dirs.includes(recomended_dirs[i]) && recomended == false){
				dir = recomended_dirs[i]
				recomended = true
				// console.log("recomended DIR" + dir)
			}
		}
		
		if (recomended == false){
			// console.log("avaiable")
			//opcion aleatoria dentro de las direcciones posibles
			dir = avaiable_dirs[Math.floor(Math.random()*avaiable_dirs.length)];
			// console.log("random DIR " + dir)
		}
		
		this.last_dir = dir
		
		this.htmlElement[0].classList.remove("right","left","up","down")
		
		switch(dir){
		case 1:
			if(this.col < mapCols-1){
				col++
				// console.log("right")
				this.direction = "right"			
			}
			break;
		
		case 2:
			if(this.row > 0){
				row--
				// console.log("up")
				this.direction = "up"
			}
			break;
		
		case 3:
			if(this.row < mapRows-1){
				row++
				// console.log("down")
				this.direction = "down"
			}
			break;
		
		case 4:
			if(this.col > 0){
				col--
				// console.log("left")
				this.direction = "left"
				
			}				
			break;
		}
		this.htmlElement.addClass(this.direction)

		this.setPosition(col,row)
		let id = "r"+row+"c"+col
		let police_cell = map.getCell(id)
		//la proxima posicion del poli
		// $("#dummy_circle").offset(police_cell.offset())
		//luces del poli
		let lights_container = this.lights.parent()
		let negative_left_margin = lights_container.width()/2
		let negative_top_margin = lights_container.height()/2
		
		let offset = police_cell.offset()
		let definitive_top = offset.top - negative_top_margin + police_cell.height()/2
		let definitive_left = offset.left - negative_left_margin + police_cell.width()/2
		
		
		this.lights.parent().animate({top:definitive_top, left:definitive_left}, this.movementTime)
		
		
		
	}

	lightsOn(){
		window.setInterval(function() {
			
			// let lights = $("#police_lights_"+this.)
			// let lights = $("#police_lights_"+this.)

			let is_blue = this.lights[0].classList.contains("blue")
			if(is_blue){
				this.lights.addClass("red")
				this.lights[0].classList.remove("blue")
			}
			else {
				this.lights.addClass("blue")
				this.lights[0].classList.remove("red")
			}
		}.bind(this), 2000)
		
	}
}
