class Rocket {
  constructor({
    dna = new DNA(),
    pos = createVector(width / 2, height - 10),
    target
  } = {}) {
    this.dna = dna
    this.target = target

    this.acc = createVector()
    this.vel = createVector()
    this.pos = pos

    this.completed = false
    this.crashed = false
    this.step = 0
  }

  draw() {
    push()
    noStroke()
    if (this.crashed) {
      fill(255, 0, 0, 150)
    } else {
      fill(255, 150)
    }

    // Move to the position of the rocket
    translate(this.pos.x, this.pos.y)

    // Rotate to face the direction the rocket is moving
    rotate(this.vel.heading())

    triangle(8, 0, -7, -5, -7, 5)
    pop()
  }

  update() {
    if (this.crashed || this.completed) {
      return
    }

    // Check for collisions
    const distanceToTarget = dist(
      this.pos.x,
      this.pos.y,
      this.target.x,
      this.target.y
    )

    if (distanceToTarget < 25) {
      // Within the radius of target
      this.completed = true
      this.completedStep = this.step

      // Move to center of target
      this.pos = this.target.copy()

      // Clear velocity and acceleration
      this.vel.mult(0)
      this.acc.mult(0)
    }

    if (
      this.pos.x < 0 ||
      this.pos.x > width ||
      this.pos.y < 0 ||
      this.pos.y > height
    ) {
      // Gone off the screen
      this.crashed = true
    }

    if (!this.crashed && !this.finished) {
      // Apply force to acceleration from DNA
      this.applyForce(this.dna.genes[this.step++])

      // Apply acceleration to velocity
      this.vel.add(this.acc)

      // Update position based on velocity
      this.pos.add(this.vel)

      // Clear the acceleration
      this.acc.mult(0)
    }
  }

  applyForce(force) {
    this.acc.add(force)
  }

  calculateFitness() {
    const d = dist(this.pos.x, this.pos.y, this.target.x, this.target.y)
    this.fitness = map(d, 0, width, width, 0)

    // Big bonus for completing
    if (this.completed) {
      this.fitness *= 10

      // Add an extra bonus for completing quickly
      this.fitness += (DNA.lifespan - this.completedStep) * 5
    }

    // Big penalty for crashing
    if (this.crashed) {
      this.fitness /= 5
    }
  }
}
