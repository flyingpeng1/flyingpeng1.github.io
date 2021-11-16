// Copyright 2021, Jack T Wilcom, All rights reserved.

// determines how long to wait between frames for the simulation to run at 60 fps
function frame_sleep(previous_frame_time, fps) { 
    var ms = 1000/fps

    var current_time = new Date();
    var sleep_time = ms - (current_time - previous_frame_time);

    if (sleep_time > 0) {
        return new Promise(ret => setTimeout(ret, sleep_time));
    } else {
        return new Promise(ret => setTimeout(ret, 0));
    }
}

// The general class for a particle system. Handles spawning, despawning, and physics.
// Uses a draw function for foreground and background graphics - must take ctx as argument.
class ParticleSystem { 
    constructor(ctx, fps, draw_background, draw_foreground) {
        this.ctx = ctx;
        this.spawn_queue = [];
        this.objects = [];
        this.paused = false;
        this.fps = fps
        this.wind_x_accel = 0
        this.wind_y_accel = 0
        this.draw_background = draw_background;
        this.draw_foreground = draw_foreground;
    };

    // queues spawing of different particle types for next cycle - yes, you can make emitter emitters. This shouldn't be a problem...
    spawn(type, posx, posy, lifetime, args) {
        switch(type) {
            case "abstract":
                this.spawn_queue.push(new Particle(new Vector(posx,posy), lifetime));
                break;
            case "emitter":
                var emi = new Emitter(new Vector(posx,posy), lifetime, args[0], args[1], args[2], args[3], args[4], args[5]);
                this.spawn_queue.push(emi);
                break;
            case "rain":
                this.spawn_queue.push(new RainParticle(new Vector(posx,posy), lifetime));
                break;
            case "snow":
                this.spawn_queue.push(new SnowParticle(new Vector(posx,posy), lifetime, args[0]));
                break;
            case "cool_particle":
                this.spawn_queue.push(new CoolParticle(new Vector(posx,posy), lifetime, args[0]));
                break;
            default:
                console.log("Unknown particle type");
        }
    };

    // Queues spawing of different particle types for next cycle takes a particle object
    spawn_direct(obj) {
        this.spawn_queue.push(obj);
        return true;
    };

    // Pauses and unpauses the simulation
    set_pause(state) {
      this.paused = state;
    };

    // Resets simulation parameters and objects.
    clear() {    
      this.objects = [];
      this.spawn_queue = [];
      this.paused = false;
      this.wind_x_accel = 0
      this.wind_y_accel = 0
    }
};

// async function outside of class
// This is the main loop that cycles through physics steps.
// It moderates the fps by asyncronously waiting until the right amount of time has passed between frames.
ParticleSystem.prototype.run = async function() {
    this.frame_time = new Date();
    this.running = true;

      // Break out of the loop when running is set to false
      while(this.running) {
          // determine how long it takes to make a frame
          this.frame_time = new Date();

          //If I am paused, I want to skip to the pause message and not do any physics
          if (!this.paused) {
              // add in particles from spawn queue
              for (var i = 0; i < this.spawn_queue.length; i++) {
                  this.objects.push(this.spawn_queue[i]);
              }
              this.spawn_queue = []

              //drawing things that are in the background
              if (this.draw_background != null) {
                  this.draw_background(this.ctx);  
              }
      
              // update each particle
              for (var i = 0; i < this.objects.length; i++) {
                  if (this.objects[i].dead()) {
                      this.objects.splice(i,1);
                      i--;
                  } else {
                      //update
                      this.objects[i].update();
                      //draw
                      this.objects[i].draw(this.ctx);

                      //gravity and wind
                      if (this.objects[i].do_gravity) {
                          this.objects[i].accel.posx = this.objects[i].horiz_weight + this.wind_x_accel
                          this.objects[i].accel.posy = this.objects[i].vert_weight + this.wind_y_accel
                      }
                  }
              }

              //drawing things that go in the foreground
              if (this.draw_foreground != null) {
                  this.draw_foreground(this.ctx);  
              }

              // making particles interact with eath other
              for (var i = 0; i < this.objects.length; i++) {
                  if (this.objects[i].type == "emitter") {
                      this.objects[i].emit(this);
                      this.objects[i].repulse(this);
                  }
              }

          } else {
              // If the simulation is paused, keep running at correct framerate, but show a paused message.
              this.ctx.fillStyle = "white";
              this.ctx.font = '48px serif';
              this.ctx.fillText("PAUSED", 20, 50)
          }

          // wait until it is time to draw the next frame
          await frame_sleep(this.frame_time, this.fps);
      }
 };
