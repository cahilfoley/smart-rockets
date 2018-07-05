class DNA {
  constructor({
    genes = []
  } = {}) {
    while (genes.length < DNA.lifespan) {
      const newForce = p5.Vector.random2D()
      newForce.setMag(DNA.maxForce)
      genes.push(newForce)
    }

    this.genes = genes
  }

  crossover(otherGenes) {
    const newGenes = []
    const mid = floor(random(this.genes.length))

    for (let i = 0; i < DNA.lifespan; i++) {
      if (i < mid) {
        newGenes.push(this.genes[i])
      } else {
        newGenes.push(otherGenes[i])
      }
    }

    return new DNA({
      genes: newGenes
    })
  }

  mutate() {
    for (let i = 0; i < DNA.lifespan; i++) {
      if (random() < DNA.mutationRate) {
        this.genes[i] = p5.Vector.random2D()
        this.genes[i].setMag(DNA.maxForce)
      }
    }
  }
}

DNA.lifespan = 400
DNA.maxForce = 0.3
DNA.mutationRate = 0.05