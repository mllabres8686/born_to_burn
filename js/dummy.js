console.log("class dummy loaded")

class Dummy {
	"use strict"
	id = null
	row = 0
	col = 0
	posX = 0
	posY = 0
	htmlElement = null
	movementTime = 200
	life = false
	loops = 0
	max_life = 0
	last_dir = null
	target_cell = null
	self = this
	
	
	constructor(id){
		this.htmlElement = $(id)
		
		this.id = id
	}
	
	
	
	setPosition(col, row){
		this.col = col
		this.row = row
		let id ="r"+row+"c"+col
		let cell_offset = map.getCell(id).offset()
		
		this.move(cell_offset)
	}
	
	move(cell_offset){
		this.htmlElement.animate(cell_offset,this.movementTime)
		this.posX = cell_offset.top
		this.posY = cell_offset.left
	}
	
	setAsDummy(num){
		this.htmlElement.addClass("dummy_"+num)
		
		setTimeout(this.live.bind(this), 555500)
		
		this.movementTime = Math.floor(Math.random() * (300 - 200 + 1) + 200)
		
		this.max_life = Math.floor(Math.random() * (1000 - 25 + 1) + 25)
		
		
	}
	
	talk(){
		console.log("hi")
	}
	
	die(){
		clearInterval(this.life);
		console.log(this.id + " IS DEAD after " + this.max_life + " cycles!")
		console.log(this)
	}
	
	live(){
		// let m = this
		this.life = window.setInterval(function() {
			this.loops++
			if (this.max_life <= this.loops) {
				this.die()
			}
			
			
			let dir = Math.floor(Math.random() * (4 - 1 + 1) + 1)
			let id = "r"+this.row+"c"+this.col

			if(map.getCell(id).hasClass('global_target')){
				
				let new_objective = map.returnRandomFreeCell()
				map.setTargetCell(new_objective)
			}
			this.smartMove()
			// this.autoMove(dir)
			// this.talk()
			
			
		}.bind(this),this.movementTime)
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
	
	smartMove(){
		let row,col
		col = this.col
		row = this.row
		let avaiable_dirs = []
		let recomended_dirs = []
		let dir = null
		

		let current_cell = map.getCell("r"+row+"c"+col)
		
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
			// console.log("right")
		}	
		if(col > map.target_cell.col){
			recomended_dirs.push(4)
			// console.log("left")
		}	
		if(row < map.target_cell.row){
			recomended_dirs.push(3)
			// console.log("down")
		}
		if(row > map.target_cell.row){
			recomended_dirs.push(2)
			// console.log("up")
		}
		
		recomended_dirs.sort()
		
		let recomended = false
		for(let i = 0 ; i < recomended_dirs.length ; i++){
			if(avaiable_dirs.includes(recomended_dirs[i]) && recomended == false){
				dir = recomended_dirs[i]
				recomended = true
				// console.log("recomended " + dir)
			}
		}
		
		if (recomended == false){
			// console.log("avaiable")
			//opcion aleatoria dentro de las direcciones posibles
			dir = avaiable_dirs[Math.floor(Math.random()*avaiable_dirs.length)];
		}
		
		this.last_dir = dir
		
		switch(dir){
		case 1:
			if(this.col < mapCols-1){
				col++
				// console.log("right")
			}
			break;
		
		case 2:
			if(this.row > 0){
				row--
				// console.log("up")
			}
			break;
		
		case 3:
			if(this.row < mapRows-1){
				row++
				// console.log("down")
			}
			break;
		
		case 4:
			if(this.col > 0){
				col--
				// console.log("left")
			}				
			break;
			
		}
		this.setPosition(col,row)
		let id = "r"+row+"c"+col
		let dummy_cell = map.getCell(id)
		$("#dummy_circle").offset(dummy_cell.offset())
	}
}
