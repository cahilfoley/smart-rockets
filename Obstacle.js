class Obstacle {
  constructor(x, y, w, h) {
    this.left = min(x, x + w)
    this.right = max(x, x + w)
    this.top = min(y, y + h)
    this.bottom = max(y, y + h)

    this.width = this.right - this.left
    this.height = this.bottom - this.top
  }

  draw() {
    fill(255)
    noStroke()
    rect(this.left, this.top, this.width, this.height)
  }

  checkCollision(x, y) {
    const { left, right, top, bottom } = this
    if (x > left && x < right && y > top && y < bottom) {
      return true
    }
    return false
  }
}
