console.log("class police loaded")

class Police {
	"use strict"
	id = null
	row = 0
	col = 0
	posX = 0
	posY = 0
	htmlElement = null
	movementTime = 750
	life = false
	last_dir = null
	target_cell = null
	direction = null
	lights = null
	lights_on = false
	mode = "random"
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
		this.home = {
			row:row,
			col:col
		}
		this.posX = cell_offset.top
		this.posY = cell_offset.left
		this.htmlElement.offset(cell_offset)
		
		// this.movementTime = Math.floor(Math.random() * (300 - 150 + 1) + 150)
		// this.movementTime = Math.floor(Math.random() * (600 - 400 + 1) + 400) + 250
		// this.movementTime = 550
		
		// setTimeout(this.live.bind(this), 555500)
	}
	
	setActionTime(time){
		this.movementTime = time
	}
	
	getActionTime(){
		return this.movementTime
	}
	
	scanRadiusCells(n){
		map.cleanScannedCells()
		let min_row = this.row - n
		let min_col = this.col - n
		let diameter = n * 2 + 1
		let row_limit = min_row + diameter
		let col_limit = min_col + diameter
		let enter_into_hunter_mode = false
		for(let r = min_row; r < row_limit ; r++){
			for(let c = min_col; c < col_limit ; c++){
				// console.log("row " + r + " col " + c)
				if(r >= 0 && r < map.rows && c >= 0 && c < map.cols){
					if(map.checkCellIsFree(r, c)){
						//TODO revisar si DUDE o FOLOWERS tienen ROW+COL iguales
						if(this.scanCell(r,c) == true){
							console.log("HUNTER MODE!!!!!")
							map.cleanScannedCells()
							this.mode = "hunting"
							
							return
						}
						
					}
					// let id ="r"+r+"c"+c
					// map.getCell(id)
				}
			}
		}
	}
	
	scanCell(r, c){
		//TODO revisar si DUDE o FOLOWERS tienen ROW+COL iguales
		// console.log(dude.row == r, dude.col == c)
		if(dude.row == r && dude.col == c){
			// console.log("DUDE IN RANGE")
			return true
		}
		for(let follower in dude.followers){
			if(follower.row == r && follower.col == c){
				return true
			}
		}
	}
	
	scanCellDude(r, c){
		//TODO revisar si DUDE o FOLOWERS tienen ROW+COL iguales
		if(dude.row == r && dude.col == c){
			return true
		}
	}
	
	scanCellFollowers(r, c){
		//TODO revisar si DUDE o FOLOWERS tienen ROW+COL iguales
		for(let follower in dude.followers){
			if(follower.row == r && follower.col == c){
				return true
			}
		}
	}
	
	setPosition(col, row){
		this.col = col
		this.row = row
		let id ="r"+row+"c"+col
		let cell_offset = map.getCell(id).offset()
		
		this.move(cell_offset)
	}
	
	move(cell_offset){
		this.htmlElement.animate(cell_offset, this.movementTime- 10)
		this.posX = cell_offset.top
		this.posY = cell_offset.left
	}
	

	live(){
		this.life = window.setInterval(function() {			
			if(this.mode == "hunting"){
				map.cleanScannedCells()
				let dude_cell = {
					row:dude.row,
					col:dude.col
				}
				map.setTargetCell(dude_cell)
				
				this.smartMove()
				this.lightsOn()
			}
			
			else if(this.mode == "home"){
				map.setTargetCell(this.home)
				this.smartMove()
			}
			
			else{
				this.scanRadiusCells(2)
				this.randomMove()
				// this.scanRadiusCells(2)
			}
		}.bind(this), this.getActionTime())
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
		
		this.htmlElement[0].classList.remove("right","left","up","down")
		switch(dir){
		case 1:
			if(this.col < mapCols-1){
				col++
				this.direction = "right"
			}
			break;
		
		case 2:
			if(this.row > 0){
				row--
				this.direction = "up"
			}
			break;
		
		case 3:
			if(this.row < mapRows-1){
				row++
				this.direction = "down"
			}
			break;
		
		case 4:
			if(this.col > 0){
				col--
				this.direction = "left"
			}				
			break;
			
		}
		this.htmlElement.addClass(this.direction)

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
		//la proxima posicion del poli
		// $("#dummy_circle").offset(police_cell.offset())
		
		//luces del poli
		// let id = "r"+row+"c"+col
		// let police_cell = map.getCell(id)
		
		
		// let lights_container = this.lights.parent()
		// let negative_left_margin = lights_container.width()/2
		// let negative_top_margin = lights_container.height()/2
		
		// let offset = police_cell.offset()
		// let definitive_top = offset.top - negative_top_margin + police_cell.height()/2
		// let definitive_left = offset.left - negative_left_margin + police_cell.width()/2
		
		
		// this.lights.parent().animate({top:definitive_top, left:definitive_left}, this.movementTime)
		
		
		
	}

	lightsOn(){
		
		// window.setInterval(function() {
			
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
			
			let id = "r"+this.row+"c"+this.col
			let police_cell = map.getCell(id)
			
			
			let lights_container = this.lights.parent()
			let negative_left_margin = lights_container.width()/2
			let negative_top_margin = lights_container.height()/2
			
			let offset = police_cell.offset()
			let definitive_top = offset.top - negative_top_margin + police_cell.height()/2
			let definitive_left = offset.left - negative_left_margin + police_cell.width()/2
			
			
			this.lights.parent().animate({top:definitive_top, left:definitive_left}, this.getActionTime())
		// }.bind(this), 2000)
		
	}
}
