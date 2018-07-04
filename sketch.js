let population

window.setup = function() {
  createCanvas(600, 600)
  population = new Population()
}

window.draw = function() {
  background(0)
  population.update()
  population.draw()
}
