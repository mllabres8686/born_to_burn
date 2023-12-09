console.log("gamepad loaded")


class Gamepad {
	"use strict"
	gamepadIndex = null
	htmlElement = null
	id = null
	axes = null
	leftH = false
	leftV = false
	rightH = false
	rightV = false
	window_gamepad = null
	
	constructor(id){
		this.id = id
		this.htmlElement = $("#" + id)
		
	}
	
	setGamepad(idx){
		this.gamepadIndex = idx
		
		setInterval(() => {
			if(this.gamepadIndex !== null){
				this.window_gamepad = navigator.getGamepads()[this.gamepadIndex];
				this.axes = this.window_gamepad.axes
				// $("#left-hor").text(Math.round(this.window_gamepad.axes[0]))
				// $("#left-ver").text(Math.round(this.window_gamepad.axes[1]))
				// $("#right-hor").text(Math.round(this.window_gamepad.axes[2]))
				// $("#right-ver").text(Math.round(this.window_gamepad.axes[3]))
			}
		}, 100)
	}

	// window.addEventListener('gamepadconnected', (event) => {
		// this.gamepadIndex = event.gamepad.index
	// })

	
	// $("#left-hor").addEventListener("change", (event) => {
		// console.log(event)
	// });
}