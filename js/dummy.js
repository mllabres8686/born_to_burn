console.log("class dummy loaded")

// dummy 1 = de rojo
// dummy 2 = de negro
// dummy 3 = abuela
// dummy 4 = deportista
// dummy 5 = ravera

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
	direction = null
	target_cell = null
	current_animation_frame = 0
	animation = null
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
		
		// this.movementTime = Math.floor(Math.random() * (1300 - 1200 + 1) + 1200)
		
		this.max_life = Math.floor(Math.random() * (1000 - 250 + 1) + 250)
		
		if(num == 5){
			this.movementTime = 1200
		}
		if(num == 4){
			this.movementTime = 700
		}
		if(num == 3){
			this.movementTime = 2000
		}
		if(num == 2){
			this.movementTime = 1000
		}
		if(num == 1){
			this.movementTime = 1000
		}
		
		
	}
	
	talk(){
		console.log("hi")
	}
	
	die(){
		clearInterval(this.life);
		clearInterval(this.movementAnimation);
		console.log(this.id + " IS DEAD after " + this.max_life + " cycles!")
		console.log(this)
	}
	
	live(){
		// let m = this
		this.movementAnimation()
		this.life = window.setInterval(function() {
			this.loops++
			if (this.max_life <= this.loops) {
				this.die()
			}
			
			
			// let dir = Math.floor(Math.random() * (4 - 1 + 1) + 1)
			// let id = "r"+this.row+"c"+this.col

			// if(map.getCell(id).hasClass('global_target')){
				
				// let new_objective = map.returnRandomFreeCell()
				// map.setTargetCell(new_objective)
			// }
			// this.smartMove()
			this.randomMove()
			// this.autoMove(dir)
			// this.talk()
			
			
		}.bind(this),this.movementTime)
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
	
	movementAnimation(){
		
		let animation_frame = null
		this.animation = window.setInterval(function() {	
			
			this.current_animation_frame ++
			if (this.current_animation_frame > 3){
				this.current_animation_frame = 0
			}
						
			switch(this.current_animation_frame){
				case 0:		
					animation_frame = "0% center"
					break;
				case 1:
					animation_frame = "35% center"
					break;
				case 2:
					animation_frame = "65% center"
					break;
				case 3:
					animation_frame = "104% center"
					break;
			}
			this.htmlElement.css("background-position", animation_frame)
		}.bind(this),this.movementTime/4)
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
		// let avaiable_dirs = []
		let recomended_dirs = []
		let dir = null
		
		let avaiable_dirs = this.getAvailableCells(col, row)
		

		let current_cell = map.getCell("r"+row+"c"+col)
		
		//comprueba las celdas adyacentes y propone las que estan libres commo posibles direcciones
		/*
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
		*/
		
			
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
		// $("#dummy_circle").offset(dummy_cell.offset())
	}
}
