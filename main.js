
let particles = [];
let checkQuadtree;
let chDedbug;
let pFrame;
let eleNum;
let eleNumLabel;
let totalParticles;

function setup() {
    createCanvas(800, 600);

    totalParticles = 1000;

    /* Cria as partículas */
    createParticles(totalParticles);
    

    checkQuadtree = document.getElementById('chQuadTree');
    pFrame = document.getElementById('pFrameRate');
    eleNum = document.getElementById('eleNum');
    eleNumLabel = document.getElementById('eleNumLabel');
    chDedbug = document.getElementById('chDedbug');

    setInterval(()=>{
        if (eleNum.value != totalParticles)
        {
            totalParticles = parseInt(eleNum.value);
            particles = [];
            createParticles(totalParticles);

        }
        pFrame.innerText = `FPS:  ${Math.floor(frameRate())}`;
        eleNumLabel.innerText = `Número de partícluas: ${eleNum.value}`;
    },500)

    
}
  
function draw() {
    background(0);
    

    let boundary = new Rectangle(0,0,width,height);
    let qtree = new QuadTree(boundary, 4)



    for (const p of particles) {
        let point = new Point(p.x, p.y, p);
        qtree.insert(point);


        p.move();
        p.render();
        p.setHighlight(false)
    }

    if (chDedbug.checked && checkQuadtree.checked) 
    {
        qtree.show();
    }


    for (const p of particles) {
        let range = new Circle(p.x, p.y, p.r*2);
        let points = qtree.query(range)

        if (checkQuadtree.checked)
        {
            for (const point of points) {
                let other = point.userData;
                if(p !== other && p.intersects(other))
                {
                    p.setHighlight(true);
                }
            }
        }
        else
        {
            for(let other of particles){
                if(p !== other && p.intersects(other))
                {
                    p.setHighlight(true);
                }
            }
        }
        
    }

    
}


function createParticles(n)
{
    for (let i = 0; i < n; i++) {
        particles[i] = new Particle(random(width), random(height));
    }
}