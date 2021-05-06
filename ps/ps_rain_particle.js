// Copyright 2021, Jack T Wilcom, All rights reserved.

// Particle object that looks like rain
class RainParticle extends Particle {
  constructor(position_vec, lifetime) {
    super(position_vec, lifetime);
    this.type = "rain";
    this.past_locations = [];

    // used to tweak the physics of the particles
    this.horiz_weight = 0
    this.vert_weight = 2
    this.max_horiz_velocity = 3
    this.max_vert_velocity = 15
};

  // Remembers where I have been, so I can draw a trail
  update() {
    super.update();
    this.past_locations.push([this.pos.posx, this.pos.posy]);
    if (this.past_locations.length > 5) {
      this.past_locations.splice(0,1);
    }
  };

  // draws a rain trail
  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'blue';
    for (var i = 0; i < this.past_locations.length; i++) {
      ctx.lineTo(this.past_locations[i][0], this.past_locations[i][1]);
      ctx.moveTo(this.past_locations[i][0], this.past_locations[i][1]);
    }
    ctx.stroke();
  };
};
