class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.r = 4;
      this.highlight = false;
    }
  
    intersects(other) {
      let d = dist(this.x, this.y, other.x, other.y);
      return d < this.r + other.r;
    }
  
    setHighlight(value) {
      this.highlight = value;
    }
  
    move() {
      this.x += random(-1, 1);
      this.y += random(-1, 1);
    }
  
    render() {
      noStroke();
      if (this.highlight) {
        fill(255,100,100);
      } else {
        fill(100);
      }
      ellipse(this.x, this.y, this.r * 2);
    }
}

class Circle {
    constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.rSquared = this.r * this.r;
    }
  
    contains(point) {
      // check if the point is in the circle by checking if the euclidean distance of
      // the point and the center of the circle if smaller or equal to the radius of
      // the circle
      let d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
      return d <= this.rSquared;
    }
  
    intersects(range) {
      var xDist = Math.abs(range.x - this.x);
      var yDist = Math.abs(range.y - this.y);
  
      // radius of the circle
      var r = this.r;
  
      var w = range.w;
      var h = range.h;
  
      var edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2);
  
      // no intersection
      if (xDist > r + w || yDist > r + h) return false;
  
      // intersection within the circle
      if (xDist <= w || yDist <= h) return true;
  
      // intersection on the edge of the circle
      return edges <= this.rSquared;
    }
  }