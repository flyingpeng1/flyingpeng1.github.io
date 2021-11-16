// Copyright 2021, Jack T Wilcom, All rights reserved.

// Emitter class - spawns new particles according to parameters
class InvisibleEmitter extends Emitter{
  constructor(position_vec, lifetime, repulsion_factor, spawn_rate, spawn_type, child_lifetime=100, x_width=10, y_width=10) {
    super(position_vec, lifetime, repulsion_factor, spawn_rate, spawn_type, child_lifetime, x_width, y_width);
  }

  draw(ctx) {
/*
    ctx.beginPath();
    ctx.arc(this.pos.posx, this.pos.posy, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'blue';
    ctx.stroke();
*/
  };


}