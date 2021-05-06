// Copyright 2021, Jack T Wilcom, All rights reserved.

// This is a class for running a few different paricle demos
// You would not want to use this for general purposes.
// If you are trying to use the particle system for something else, use a ParticleSystem object directly.
class psDemo {
	constructor(canvas_name, fps) {
		this.c = document.getElementById(canvas_name);
		this.ctx = this.c.getContext("2d");
		this.listeners=[];

		this.ps = new ParticleSystem(this.ctx, fps, null, null);

		this.demo_mode = 0;
		this.swarmDemo();
		this.ps.run()
	}

	//returns x,y position of the mouse
	mousePos(c, e) {
   		var rect = c.getBoundingClientRect();
  	 	return [e.clientX - rect.left, e.clientY - rect.top]
	}

	// Keeping track of which event listeners are on the canvas
	addListener(type, fn) {
		this.listeners.push([type,fn]);
		this.c.addEventListener(type, fn);
	}

	// Removing all of the event listeners
	clearListeners() {
		for(var i=0; i < this.listeners.length; i++) {
			this.c.removeEventListener(this.listeners[i][0], this.listeners[i][1]);
		} 
		this.listeners = [];
	}

	// Clearing the particle system in order to change demo, then switching demo.
	cycleDemo() {
		this.clearListeners();
		this.ps.clear()
		this.ps.draw_background = null;
		this.ps.draw_foreground = null;

		this.demo_mode+=1;
		if (this.demo_mode > 2) {
			this.demo_mode = 0
		}

		switch(this.demo_mode) {
			case 0:
				this.swarmDemo();
				break;
			case 1:
				this.rainDemo();
				break;
			case 2:
				this.snowDemo()
		}
	}

	//--------------------------------------------------------------------
	// This is a demo of "insects" buzzing around and following the cursor
	//--------------------------------------------------------------------
	swarmDemo() {
		// for callbacks
		var parent = this;

		// new background/foreground graphics
		this.ps.draw_background = function(context) { 
			context.fillStyle = "black";
      		context.fillRect(0, 0, parent.c.width, parent.c.height);
      	};

		// set up the environment interaction for the mouse
		var mouse_interaction = new Emitter(new Vector(200,200), -1, -3, 8, "abstract", 400, 100, 100);
		mouse_interaction.is_emitting = true;
		this.ps.spawn_direct(mouse_interaction);

		// Clicking makes abstract particles appear and middle click spawns an emitter
		this.addListener("mousedown", function(e) {
			var pos = parent.mousePos(parent.c, e);
			if (e.button == 0) {
				parent.ps.spawn("abstract", pos[0], pos[1], 100);
			} else if (e.button == 1) {
				parent.ps.spawn("emitter", pos[0], pos[1], -100, [0.4, 3, "abstract", 100, 10, 10]);
			}
		});

		// Making the mouse interaction emitter follow the mouse
		this.addListener("mousemove", function(e) {
			var pos = parent.mousePos(parent.c, e);
			mouse_interaction.pos.posx = pos[0];
			mouse_interaction.pos.posy = pos[1];
		});

		// Interactions with the keyboard - this is the same for all the demos, but doesn't have to be.
		this.addListener("keydown", function(e) {
			if (e.key === " ") {
				parent.ps.set_pause(!parent.ps.paused);
			} else if (e.key === "f" || e.key === "F") {
				parent.cycleDemo();
			}
		});
	}

	//--------------------------------------------------------------------
	// This is a demo of rain falling from the clouds with a variable wind
	//--------------------------------------------------------------------
	rainDemo() {
		// for callbacks
		var parent = this;

		// new background/foreground graphics
			this.ps.draw_background = function(ctx) { 
				ctx.fillStyle = "gray";
      			ctx.fillRect(0, 0, parent.c.width, parent.c.height); 
  			};

  			this.ps.draw_foreground = function(ctx) { 
				ctx.fillStyle = "black";
				ctx.strokeStyle = "white";
				ctx.lineWidth = 2;

				//clouds
				for (var i=0; i < parent.c.width+100; i+=100) {
      				ctx.beginPath();
   					ctx.arc(i, 0, 80, 0, 2 * Math.PI, false);
    				ctx.fill();
    				ctx.stroke();
    			}
    		}

    	// This is the emitter behind the clouds that makes it rain
		var rain_emitter = new Emitter(new Vector(parent.c.width/2,-20), -1, 0, 10, "rain", 100, parent.c.width+200, 5);
		this.ps.spawn_direct(rain_emitter);

		// Clicking makes rain particles appear and middle click spawns an emitter
		this.addListener("mousedown", function(e) {
			var pos = parent.mousePos(parent.c, e);
			if (e.button == 0) {
				parent.ps.spawn("rain", pos[0], pos[1], 100);
			} else if (e.button == 1) {
				parent.ps.spawn("emitter", pos[0], pos[1], -100, [0.4, 3, "rain", 100, 10, 10]);
			}
		});

		// Making the wind direction follow the mouse
		this.addListener("mousemove", function(e) {
			var pos = parent.mousePos(parent.c, e);
			var wind_direction = (pos[0] - (parent.c.width/2))/10;
			parent.ps.wind_x_accel = wind_direction;
		});

		// Interactions with the keyboard - this is the same for all the demos, but doesn't have to be.
		this.addListener("keydown", function(e) {
			if (e.key === " ") {
				parent.ps.set_pause(!parent.ps.paused);
			} else if (e.key === "f" || e.key === "F") {
				parent.cycleDemo();
			}
		});
	}

	//--------------------------------------------------------------------------
	// This is a demo of snow falling, landing on the ground, and blowing around.
	//--------------------------------------------------------------------------
	snowDemo() {
		// for callbacks
		var parent = this;

		// new background/foreground graphics
		this.ps.draw_background = function(ctx) { 
			ctx.fillStyle = "black";
      		ctx.fillRect(0, 0, parent.c.width, parent.c.height); 
  		};

  		this.ps.draw_foreground = function(ctx) { 
			ctx.fillStyle = "white";
			ctx.strokeStyle = "gray";
			ctx.lineWidth = 2;

			//clouds
			for (var i=0; i < parent.c.width + 100; i+=100) {
      			ctx.beginPath();
   				ctx.arc(i, 0, 80, 0, 2 * Math.PI, false);
    			ctx.fill();
    			ctx.stroke();
    		}
  		};

  		// Makes snow fall from the clouds
  		var snow_emitter = new Emitter(new Vector(parent.c.width/2,-20), -1, 0, 10, "snow", 1000, parent.c.width+200, 5);
  		snow_emitter.child_args = [parent.c.height];
		this.ps.spawn_direct(snow_emitter);

		// allows the mouse to blow particles around
		var mouse_interaction = new Emitter(new Vector(200,200), -1, 0.8, 0, "snow", 400, 100, 100);
		mouse_interaction.is_emitting = false;
		this.ps.spawn_direct(mouse_interaction);

		// Making the snow blower follow the mouse
		this.addListener("mousemove", function(e) {
			var pos = parent.mousePos(parent.c, e);
			mouse_interaction.pos.posx = pos[0];
			mouse_interaction.pos.posy = pos[1];
		});

		// Interactions with the keyboard - this is the same for all the demos, but doesn't have to be.
		this.addListener("keydown", function(e) {
			if (e.key === " ") {
				parent.ps.set_pause(!parent.ps.paused);
			} else if (e.key === "f" || e.key === "F") {
				parent.cycleDemo();
			}
		});
	}
}

//Running the demo on load @ 60 fps
var demo = new psDemo("screen", 60);