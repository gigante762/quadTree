class Point{
    constructor(x,y,userData)
    {
        this.x = x;
        this.y = y;
        this.userData = userData;
    }
}

class Rectangle{
    constructor(x,y,w,h)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point)
    {
        return (
            point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h
            );
    }

    intersects(range)
    {
        return !(range.x-range.w > this.x+this.w ||
         range.x + range.w < this.x-this.w||
         range.y-range.h > this.y+this.h ||
         range.y + range.h < this.h - this.w
         );
    }
}

class QuadTree{
    constructor(boundary,capacity)
    {
        if (!boundary) {
            throw TypeError('boundary is null or undefined');
          }
          if (!(boundary instanceof Rectangle)) {
            throw TypeError('boundary should be a Rectangle');
          }
          if (typeof capacity !== 'number') {
            throw TypeError(
              `capacity should be a number but is a ${typeof capacity}`
            );
          }
          if (capacity < 1) {
            throw RangeError('capacity must be greater than 0');
          }


        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    insert(point)
    {
        if (!this.boundary.contains(point))
        {
            return false;
        }

        if (this.points.length < this.capacity)
        {
            this.points.push(point);
            return true;
        }
        
        if(!this.divided)
        {
            this.subdivide();
        }

        return (this.northeast.insert(point) ||
        this.nortwest.insert(point) ||
        this.southeast.insert(point) ||
        this.southwest.insert(point));
            
        
    }

    subdivide()
    {

        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let ne = new Rectangle(x+w/2, y-h/2,w/2, h/2);
        let nw = new Rectangle(x-w/2, y-h/2,w/2, h/2);
        let se = new Rectangle(x+w/2, y+h/2,w/2, h/2);
        let sw = new Rectangle(x-w/2, y+h/2,w/2, h/2);

        this.northeast = new QuadTree(ne,this.capacity);
        this.nortwest = new QuadTree(nw,this.capacity);
        this.southeast = new QuadTree(se,this.capacity);
        this.southwest = new QuadTree(sw,this.capacity);

        this.divided = true;
    }

    show()
    {
        stroke(255);
        strokeWeight(1);
        noFill();
        rectMode(CENTER);
        rect(this.boundary.x,this.boundary.y, this.boundary.w*2,this.boundary.h*2);
        if (this.divided)
        {
            this.northeast.show();
            this.nortwest.show();
            this.southeast.show();
            this.southwest.show();
        }
        
        strokeWeight(4);
        for (const p of this.points) {
            point(p.x, p.y);
        }
        
    }

    query(range,found)
    {

        if (!found)
        {
            found = [];
        }

        if (!range.intersects(this.boundary)) {
            return found;
        }

        else
        {
            for(let p of this.points)
            {
                if (range.contains(p))
                {
                    found.push(p);
                }
            }
        }
        
        if (this.divided)
        {
            this.northeast.query(range,found);
            this.nortwest.query(range,found);
            this.southeast.query(range,found);
            this.southwest.query(range,found);
        }

        return found;
    }
}