// Copyright 2021, Jack T Wilcom, All rights reserved.

// Particle object that looks like snow
class CoolParticle extends Particle {
  constructor(position_vec, lifetime, ground_y) {
    super(position_vec, lifetime);
    this.type = "cool";
    this.past_locations = [];

    // used to tweak the physics of the particles
    this.horiz_weight = 0
    this.vert_weight = 0
    this.max_horiz_velocity = 4
    this.max_vert_velocity = 4

    this.flutter = 1

    this.size = Math.random() * 6 + 1

    //used to know where the ground is supposed to be
    this.ground_y = ground_y - Math.random()*this.max_ground_height
};

  // Defines special behavior for snow physics
  update() {
    // drifting
    this.accel.posx = Math.random()*this.flutter*2 - this.flutter

    //landing on the ground
    if (this.pos.posy > this.ground_y && this.accel.posy > 0) {
      this.accel.posx = 0;
      this.accel.posy = 0;
      this.velo.posx = 0;
      this.velo.posy = 0;
    }
    super.update();

  };

  // Basically a white abstract particle
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.posx, this.pos.posy, this.size, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'gray';
    ctx.stroke();
  };
};
