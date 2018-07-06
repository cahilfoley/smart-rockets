let population
let mouseDownPoint = null
let speed = 1

const speedMap = {
  regular: 1,
  fast: 10,
  superSpeed: 50
}

function setup() {
  frameRate(60)
  const renderer = createCanvas(600, 600)
  renderer.canvas.id = 'mainCanvas'
  population = new Population()
}

function draw() {
  background(0)
  for (let i = 0; i < speed; i++) {
    population.update()
  }
  population.draw()
  if (mouseDownPoint !== null) {
    fill(255)
    let { x, y } = mouseDownPoint
    rect(x, y, mouseX - x, mouseY - y)
  }
  fill(255)
  text(`Mutation Rate: ${DNA.mutationRate}`, 10, height - 40)
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

document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', event => {
    speed = speedMap[event.target.id]
  })
})
