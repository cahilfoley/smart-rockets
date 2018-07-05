let population
let mouseDownPoint = null

function setup() {
  frameRate(60)
  createCanvas(600, 600)
  population = new Population()
}

function draw() {
  background(0)
  population.update()
  population.draw()
  if (mouseDownPoint !== null) {
    fill(255)
    let { x, y } = mouseDownPoint
    rect(x, y, mouseX - x, mouseY - y)
  }
}

function mousePressed() {
  mouseDownPoint = createVector(mouseX, mouseY)
}

function mouseReleased() {
  if (mouseDownPoint !== null) {
    let { x, y } = mouseDownPoint
    population.addObstacle(x, y, mouseX - x, mouseY - y)
    mouseDownPoint = null
  }
}
