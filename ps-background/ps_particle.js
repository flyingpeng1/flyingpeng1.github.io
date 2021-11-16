// Copyright 2021, Jack T Wilcom, All rights reserved.

// simple vector object
class Vector {
    constructor(x,y) {
      this.posx = x;
      this.posy = y;
    };

    add(other_vec) {
      this.posx = this.posx + other_vec.posx;
      this.posy = this.posy + other_vec.posy;
    };
  };

// Particle object - the basic particle that all the other ones extend.
class Particle {
  constructor(position_vec, lifetime) {
    this.accel = new Vector(0,0);
    this.velo = new Vector(0,0);
    this.pos = position_vec;
    this.type = "abstract"
    this.do_gravity = true
    this.repulsable = true
    this.lifetime = lifetime;
    this.id = 0

    // used to tweak the physics of the particles
    this.horiz_weight = 0
    this.vert_weight = 1
    this.max_horiz_velocity = 10
    this.max_vert_velocity = 10
    this.vdecayx = 1.01
    this.vdecayy = 1.01
  };

  // Called mostly for physics updates every frame
  update() {
    this.velo.posx/=this.vdecayx
    this.velo.posy/=this.vdecayy

    this.velo.add(this.accel);
    this.pos.add(this.velo);

    // enfore velocity cap
    if (this.velo.posx > this.max_horiz_velocity) {
      this.velo.posx = this.max_horiz_velocity
    } else if (this.velo.posx < -this.max_horiz_velocity) {
      this.velo.posx = -this.max_horiz_velocity
    }
    if (this.velo.posy > this.max_vert_velocity) {
      this.velo.posy = this.max_vert_velocity
    } else if (this.velo.posy < -this.max_vert_velocity) {
      this.velo.posy = -this.max_vert_velocity
    }

    if (this.lifetime > 0) {
      this.lifetime -= 1;  
    }
  };

  // Called to draw what the particle looks like
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.posx, this.pos.posy, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.stroke();
  };

  // returns true if the particle should be removed this cycle.
  dead() {
    return this.lifetime == 0;
  };
};
