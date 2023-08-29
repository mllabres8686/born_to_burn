console.log("class map loaded")
class Map {
	rows = 0
	cols = 0
	htmlElement = null
	class = "free"
	cells = []
	buildings = []
	target_cell = null
	
	
	constructor(id, rows, cols){
		this.rows = rows
		this.cols = cols
		let calculated_class
		this.htmlElement = $(id)
		for(let r = 0 ; r < this.rows ; r++){
			this.htmlElement.append("<div id='row_"+r+"' class='row'></div>")
			for(let c = 0 ; c < this.cols ; c++){
				
				// console.log(map_cells[r][c])
				// console.log(map_cells[r][c][0])
				if(map_cells[r][c][0] == 0){
					calculated_class = "free"
				} 
				else if(map_cells[r][c][0] == 1){
					calculated_class = "safe"
				}
				else if(map_cells[r][c][0] == 2){
					calculated_class = "subway"
				}
				else if(map_cells[r][c][0] == 3){
					calculated_class = "burn"
				}
				else if(map_cells[r][c][0] == 4){
					calculated_class = "police_station"
				}
				else {
					calculated_class = "occuped"
				}
				this.htmlElement.find("#row_"+r).append("<div id='r"+r+"c"+c+"' class='cell "+ calculated_class +"'></div>")
				this.cells.push($('#map #r'+r+'c'+c))
				
				
				// document.getElementById("r"+r+"c"+c).addEventListener("click", function(){
					// console.log(this.id)
					// if(this.class == "free"){
						// this.class = "occuped"
					// } else if(this.class == "occuped"){
						// this.class = "safe"
					// } else {
						// this.class = "free"
					// }
					// $("#"+this.id).removeClass("free occuped safe").addClass(this.class)
				// });
			}
		}
		
		// console.log(this.cells.filter(cell => cell[0].id == "r1c1")[0].offset())
		
	}
	
	/**Return a cell filtered by ID */
	getCell(id){
		return this.cells.filter(cell => cell[0].id == id)[0]
	}
	
	setTargetCell(cell){
		let id = "r"+cell.row+"c"+cell.col
		$("#map div").removeClass("global_target")
		let target_cell = this.cells.filter(cell => cell[0].id == id)[0]
		target_cell.addClass("global_target")
		
		$("#circle").offset(target_cell.offset())
		$("#circle").offset({top:(target_cell.offset().top-7),left:(target_cell.offset().left-6)})
		
		this.target_cell = cell
	}
	
	returnRandomFreeCell(){
		let total = $("#map").find(".cell.free").length		
		var rand = Math.floor(Math.random()*total);
		let random_cell_id = $("#map").find(".cell.free").eq(rand)[0].id
		
		
		let id_arr = random_cell_id.split('c')		
		let random_cell = {
			row:id_arr[0].split('r')[1],
			col:id_arr[1]
		}
		return random_cell
	}
}
