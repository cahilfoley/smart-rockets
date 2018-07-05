class Population {
  constructor({
    size = 250
  } = {}) {
    this.rockets = []
    this.target = createVector(width / 2, height / 4)
    this.size = size
    this.step = 0

    for (let i = 0; i < size; i++) {
      this.rockets.push(new Rocket({
        target: this.target
      }))
    }
  }

  draw() {
    this.rockets.forEach(rocket => rocket.draw())
    fill(0, 255, 0)
    ellipse(this.target.x, this.target.y, 50)
  }

  update() {
    this.rockets.forEach(rocket => rocket.update())
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
    this.rockets.forEach(rocket => {
      rocket.calculateFitness()
      maxFitness = max(maxFitness, rocket.fitness)
    })

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

      newPopulation.push(new Rocket({
        dna: newDNA,
        target: this.target
      }))
    }

    this.rockets = newPopulation
  }
}