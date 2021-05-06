// Copyright 2021, Jack T Wilcom, All rights reserved.

// Emitter class - spawns new particles according to parameters
class Emitter extends Particle{
  constructor(position_vec, lifetime, repulsion_factor, spawn_rate, spawn_type, child_lifetime=100, x_width=10, y_width=10) {
    super(position_vec, lifetime);
    this.do_gravity = false;
    this.repulsable = false;
    this.type = "emitter";
    this.is_emitting = true;
    this.spawn_timer = 10;
    this.repulsion_factor = repulsion_factor;
    this.spawn_rate = spawn_rate;
    this.spawn_type = spawn_type;
    this.child_lifetime = child_lifetime;
    this.child_args = [];
    this.x_width = x_width;
    this.y_width = y_width;
  }

  // takes a reference to the particle system in order to spawn objects.
  emit(ps) {
    if (this.is_emitting) {
      this.spawn_timer--
      if (this.spawn_timer < this.spawn_rate) {
        ps.spawn(this.spawn_type, this.pos.posx + (Math.random() * this.x_width - (this.x_width/2)), this.pos.posy + (Math.random() * this.y_width - (this.y_width/2)), this.child_lifetime, this.child_args)
        this.spawn_timer = 10
      }
    }
  }

  update() {
    super.update();
  };

  // pushing particles away
  repulse(ps) {
    if (this.repulsion_factor != 0) {
        for (var i = 0; i < ps.objects.length; i++) {
          if (ps.objects[i].repulsable) {

            // find how far away I am using the magical Pythagorean theorem
            var distx = this.pos.posx - ps.objects[i].pos.posx;
            var disty = this.pos.posy - ps.objects[i].pos.posy;
            var dist = Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2));

            //If I'm close enough, I want to enact a repulsive force on the object
           if (dist < Math.abs(this.repulsion_factor * 100)) {
              ps.objects[i].accel.posx = -(this.repulsion_factor/2)*(distx / (dist + 0.1)) * Math.random()
              ps.objects[i].accel.posy = -(this.repulsion_factor/2)*(disty/ (dist + 0.1)) * Math.random()
            }
          }
        }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.posx, this.pos.posy, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'blue';
    ctx.stroke();
  };


}