class Population {
  constructor({ size = 500 } = {}) {
    this.rockets = []
    this.obstacles = []
    this.target = createVector(width / 2, height / 4)
    this.size = size
    this.step = 0
    this.failStreak = false

    for (let i = 0; i < size; i++) {
      this.rockets.push(
        new Rocket({
          target: this.target
        })
      )
    }
  }

  addObstacle(x, y, w, h) {
    if (w !== 0 && h !== 0) {
      this.obstacles.push(new Obstacle(x, y, w, h))
    }
  }

  draw() {
    this.rockets.forEach(rocket => rocket.draw())
    fill(0, 255, 0)
    noStroke()
    ellipse(this.target.x, this.target.y, 50)
    this.obstacles.forEach(obs => obs.draw())
  }

  update() {
    this.rockets.forEach(rocket => {
      rocket.update()
      if (!rocket.crashed && !rocket.completed) {
        this.obstacles.forEach(obstacle => {
          if (obstacle.checkCollision(rocket.pos.x, rocket.pos.y)) {
            rocket.crashed = true
          }
        })
      }
    })
    this.step += 1

    if (this.step >= DNA.lifespan) {
      // Calculate fitness for all rockets and generate mating pool
      this.evaluate()

      // Select parents from mating pool and create new population
      this.naturalSelection()

      // Start steps again
      this.step = 0
    }
  }

  evaluate() {
    // Getting the max fitness
    let maxFitness = 0
    let numCompleted = 0
    this.rockets.forEach(rocket => {
      rocket.calculateFitness()
      maxFitness = max(maxFitness, rocket.fitness)
      if (rocket.completed) numCompleted++
    })

    const completionRate = numCompleted / this.rockets.length

    // Adjust mutation rate based on overall performance
    if (numCompleted === 0 && this.failStreak) {
      if (DNA.mutationRate < 0.5) {
        DNA.mutationRate += 0.01
      }
    } else {
      if (completionRate > 0.5) {
        DNA.mutationRate = 0.002
      } else if (completionRate > 0.2) {
        DNA.mutationRate = 0.005
      } else if (completionRate > 0.05) {
        DNA.mutationRate = 0.01
      } else {
        DNA.mutationRate = 0.02
      }
    }

    // Normalizing fitness values
    this.rockets.forEach(rocket => {
      rocket.fitness /= maxFitness
    })

    // Fresh mating pool
    this.matingPool = []

    // Add a rocket to the pool up to 100 times based on fitness
    this.rockets.forEach(rocket => {
      const numberOfEntries = floor(rocket.fitness * 100)
      for (let i = 0; i < numberOfEntries; i++) {
        this.matingPool.push(rocket)
      }
    })
    
    if (numCompleted === 0) {
      this.failStreak = true
    } else {
      this.failStreak = false
    }
  }

  naturalSelection() {
    // Start a new population
    const newPopulation = []

    for (let i = 0; i < this.size; i++) {
      // Randomly select parents from mating pool
      const parentA = random(this.matingPool).dna
      const parentB = random(this.matingPool).dna

      // Crossover DNA to create child strain
      const newDNA = parentA.crossover(parentB)

      // Apply mutation
      newDNA.mutate()

      newPopulation.push(
        new Rocket({
          dna: newDNA,
          target: this.target
        })
      )
    }

    this.rockets = newPopulation
  }
}
