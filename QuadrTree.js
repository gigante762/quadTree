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
            point.x >= this.x &&
            point.x <= this.x + this.w &&
            point.y >= this.y &&
            point.y <= this.y + this.h
            );
    }

    intersects(range)
    {
        return !(range.x > this.x+this.w ||
         range.x + range.w < this.x||
         range.y > this.y+this.h ||
         range.y + range.h < this.h
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

        return (this.tr.insert(point) ||
        this.tl.insert(point) ||
        this.br.insert(point) ||
        this.bl.insert(point));
            
        
    }

    subdivide()
    {

        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let tr = new Rectangle(x+w/2, y, w/2, h/2); // top left
        let tl = new Rectangle(x, y, w/2, h/2);// top right
        let br = new Rectangle(x+w/2, y+h/2,w/2, h/2);// bottom right
        let bl = new Rectangle(x, y+h/2,w/2, h/2);// bottom left

        this.tr = new QuadTree(tr,this.capacity);
        this.tl = new QuadTree(tl,this.capacity);
        this.br = new QuadTree(br,this.capacity);
        this.bl = new QuadTree(bl,this.capacity);

        this.divided = true;
    }

    show()
    {
        stroke(255);
        strokeWeight(1);
        noFill();
        rect(this.boundary.x,this.boundary.y, this.boundary.w, this.boundary.h);
        if (this.divided)
        {
            this.tr.show();
            this.tl.show();
            this.br.show();
            this.bl.show();
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
            this.tr.query(range,found);
            this.tl.query(range,found);
            this.br.query(range,found);
            this.bl.query(range,found);
        }

        return found;
    }
}