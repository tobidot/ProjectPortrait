(function (){
    let $ = jQuery;
    let game = null;

    $(document).ready( ()=>{
        let wrapper = $('#' + sc_javascript_target_id);
        wrapper.html('START');
        wrapper.click( ()=>{
            wrapper.addClass('fullscreen');
            wrapper.off('click');
            start_game(wrapper);
        } );        
    });

    function start_game(wrapper) {
        if (!Game) return;
        let canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        let ctx = canvas.getContext('2d');
        wrapper.append(canvas);
        ctx.fillStyle = "rgb(200,0,0)"; 
        ctx.fillRect(0, 0, 800, 600);
        
        game = new Game();
        game.ctx = ctx;
        game.addLemming();
                
        setInterval(function(){ 
            game.update();
            game.draw();
        }, 33);
    }


    class PixelType {
        constructor(name, key, solid) {
            if ( key < 0 || key > 255) throw new Error(key + ' is not a valid AlphaKey (Between 0 and 256)');            
            this.name = name;
            this.key = key;
            this.isSolid = solid;    
        } 
        isEqual(other) {
            return (this.key == other.key);
        }
    }
    PixelType.EMPTY = new PixelType('EMPTY', 128, false);
    PixelType.GROUND = new PixelType('GROUND', 255, true);
    PixelType.all = [
        PixelType.EMPTY,
        PixelType.GROUND
    ];
    PixelType.keys = [];
    PixelType.all.forEach( (pt) => { 
        PixelType.keys[pt.key] = pt;
    });

    class Map {
        constructor(width , height) {
            width = width || 100;
            height = height || 100;
            this.image = new ImageData(width, height);
            this.placeRect(0, 0, this.image.width , this.image.height, PixelType.EMPTY, [0,0,0]);
        }

        get(x, y) {
            if (x >= 0 && x < this.image.width && y >= 0 && y < this.image.height) {
                x = Math.trunc(x);
                y = Math.trunc(y);
                let id = (x + y * this.image.width) * 4;
                let key = this.image.data[id+3];
                let type = PixelType.keys[key];   
                if (type == null) {
                    console.error('At ' + x + ', ' + y + ' pixel key is ' + key + ' wich is not defined.');
                    type = PixelType.EMPTY;
                }           
                return type; 
            }
            return PixelType.EMPTY;
        }

        getTypeRatio(x, y, w, h, attrName) {
            x = Math.trunc(x);
            y = Math.trunc(y);
            let count = 0;
            for(let i=0;i<w;++i)
            for(let j=0;j<h;++j) {
                let tx = x + i;
                let ty = y + j;
                let pt = this.get(tx,ty);
                if (pt[attrName]) count++;
            }
            return count / (w * h);
        }

        isSolid(x, y, w, h, allowedDivergenz = 0.05) {
            return this.getTypeRatio(x, y, w, h, "isSolid") > allowedDivergenz;
        }

        set(x, y, pixelType = PixelType.GROUND, color = [50,50,50], varyingColor = true) {
            if (x >= 0 && x < this.image.width && y >= 0 && y < this.image.height) {
                x = Math.trunc(x);
                y = Math.trunc(y);
                let id = this.toID(x, y);
                if (color.length !== 3) color = [50,50,50];
                color = ((varyingColor)?color.map( (value)=>{
                    let varianz = 20 + value * 0.15;
                    return Math.max( 0, Math.min( 255, value - varianz / 2 + Math.random() * varianz ) );
                }) : color);
                this.image.data.set(color, id);
                this.image.data[id+3] = pixelType.key;
            }            
        }

        placeRect( x, y, w, h, pixelType, color) {            
            let id = this.toID(x, y);
            for(let i=0;i<w;++i) 
            for(let j=0;j<h;++j) {
                let tx = x + i;
                let ty = y + j;
                this.set(tx,ty,pixelType,color,true);
            }
        }
        
        placeLine( 
            xStart, yStart,
            xEnd, yEnd,
            width = 5, 
            pixelType = PixelType.GROUND,
            color = [50,50,50],
            varyingColor = true) 
        {    
            let distX = xEnd - xStart;
            let distY = yEnd - yStart;
            let lowY = Math.min(yStart,yEnd);
            let highY = Math.max(yStart,yEnd);
            let lowX = Math.min(xStart,xEnd);
            let highX = Math.max(xStart,xEnd);
            let dy = highY - lowY;
            let dx = highX - lowX;
            let reverseX = (yStart > yEnd && xStart < xEnd) || (yStart < yEnd && xStart > xEnd)
            let x = lowX; 
            let y = lowY;
            let px = 0, py = 0;
            for(let y=lowY;y<=highY;++y) {
                let cdy = y - yStart;
                let py = cdy / distY;
                let x = xStart + distX * py;
                for (let i=0;i<width;++i) {
                    this.set( x + i, y, pixelType, color, varyingColor );
                }
                /*
                while(px > py) {
                    
                    ++x;
                    let cdx = x - lowX;
                    px = dx / cdx;
                }*/
            }
        }
        
        draw(context) {
            context.putImageData(this.image, 0, 0);
        }

        toID(x ,y) {
            return (x + y * this.image.width) * 4;
        };
    }

    class Game {
        constructor() {
            this.ctx = null;
            this.lemmings = [];
            this.map = new Map(800,600);
            this.map.placeRect(0,200,500,20, PixelType.GROUND, [255,100,50]);
            this.map.placeRect(200, 150, 50 , 100, PixelType.GROUND, [50,0,153]);
            this.map.placeRect(0, 150, 20 , 100, PixelType.GROUND, [50,0,153]);
            this.map.placeLine(150, 200, 400, 100, 10, PixelType.GROUND, [50,200,153]);
        }   

        addLemming() {
            let l = new Lemming(50,100);
            l.updateFunction = Lemming.prototype.normal_mode.bind(l);
            this.lemmings.push(l);
        }

        update() {
            this.lemmings.forEach(lemming => {
                lemming.update();
            });
        }

        getMap() {
            return this.map;
        }

        draw() {
            this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
            this.map.draw(this.ctx);
            this.lemmings.forEach(lemming => {
                lemming.draw(this.ctx);
            });
        }
    }

    class ImgRef {
        constructor(image) {
            this.image = image;
        }
    }

    class Lemming {
        constructor(x, y) {
            this.x = x||0;
            this.y = y||0;
            this.direction = 1;
            this.updateFunction = null;
        }

        draw(context) {
            context.beginPath();
            context.rect(this.x, this.y, Lemming.width, Lemming.height);
            context.fillStyle = 'green';
            context.fill();
            context.lineWidth = 0;
            context.strokeStyle = '#003300';
            context.stroke();
        }
        
        isOnGround() {
            return this.isRelativeRectSolid( 0, Lemming.height, Lemming.width, 2 );
        }
        
        isInGround() {
            return this.isRelativeRectSolid( 0, Lemming.height / 2, Lemming.width, Lemming.height/2 );
        }


        checkRelativeRect( 
            offX, offY, 
            width = Lemming.width,
            height = Lemming.height,
            attrName = "isSolid",
            divergenz) 
        {
            let ratio = game.map.getTypeRatio(this.x + offX, this.y + offY, width, height, attrName);
            if (typeof divergenz == null) return ratio;
            else return ratio < 1 - divergenz;
        }

        isRelativeRectSolid( 
            offX, offY, 
            width = Lemming.width,
            height = Lemming.height,
            ratio = 0.05) 
        {
            return game.map.isSolid(this.x + offX, this.y + offY, width, height, ratio);
        }
        
        getForwardX(offset = 0, width = 0) {
            return (this.direction>0?(Lemming.width + offset): (-offset - width));
        }

        update() {
            if (this.updateFunction) this.updateFunction();
        }

        check_pixel_move() {
            let lemmingHalfWidth = Math.trunc(Lemming.width / 2);
            let x = this.x + lemmingHalfWidth;
            let y = this.y + Lemming.height;
            let d = this.direction;
            let center = game.map.get(x,y);
            let below = game.map.get(x,y+1);
            let forward = game.map.get(x+d,y);
            let backward = game.map.get(x+d,y);
            let upToNotSolid = function(x,y,xOff,yOff,steps = 2, acc = 0) {
                if ( steps === 0 ) return false;
                center = game.map.get(x,y);
                if (center.isSolid) return upToNotSolid(x+xOff, y+yOff, xOff ,yOff ,steps-1, acc + 1);
                return acc;
            }
            let upToSolid = function(x,y,xOff,yOff,steps = 2, acc = 0) {
                if ( steps === 0 ) return false;
                center = game.map.get(x,y);
                if (!center.isSolid) return upToSolid(x+xOff, y+yOff, xOff ,yOff ,steps-1, acc + 1);
                return acc;
            }
            let sidewardMove = function() {
                let forward = game.map.get(x+d,y);
                let backward = game.map.get(x-d,y);
                let up;
                if (!forward.isSolid && (up = upToNotSolid(x+d,y,2)) !== false ) {                    
                    x+=d;
                    y-=up;
                } else if (!backward.isSolid && (up = upToNotSolid(x-d,y,2)) !== false ) {
                    d*=-1;
                    x+=d;
                }
            };
            if (!below.isSolid) {   // Free Fall
                let height;
                if ( (height = upToSolid(x,y,0,1,10) ) !== false ) {
                    y+=height;
                } else{
                    y+=10;
                };
            } else if (center.isSolid) {    // Get higher if stucked 
                let height;
                if ( (height = upToNotSolid(x,y,0,-1,5) ) !== false ) {
                    y-=height;
                } else{
                    y-=5;
                };
            } else {    // Move forward or backward
                let up = 0;
                let down = 0;
                if ( (up = upToNotSolid(x+d,y,0,-1,5) )!== false )  {
                    if ( up === 0 && (down = upToSolid(x+d,y+1,0,1,5) ) !== false ) {
                        y += down;
                    } else {
                        y -= up;
                    }
                    x+=d;                        
                } else if ( (up = upToNotSolid(x-d,y,0,-1,5) ) !== false ) {  
                    if ( up === 0 && (down = upToSolid(x-d,y+1,0,1,5) ) !== false ) {
                        y += down;
                    } else {
                        y -= up;
                    }
                    d*=-1;
                    x+=d;            
                } else {
                    // Trapped in Walls
                }
            }
            return [x - lemmingHalfWidth, y - Lemming.height, d];
        }
        
        normal_mode() {/*
            if (!this.isOnGround()) 
            {
                this.y += 9.88;
            } else 
            {
                /*
                if (!this.isRelativeRectSolid(this.getForwardX(0,2), 0, 2, Lemming.height-1) ) 
                    this.x += this.direction * 2;
                else 
                    this.direction *= -1;  
                if ( this.isInGround() ) {
                    this.y -= 2;
                } 
            }*/
            let [x,y,d] = this.check_pixel_move();
            this.x = x;
            this.y = y; 
            this.direction = d;  
        };
    }
    Lemming.width = 15;
    Lemming.height = 15;

})();


/**
 * 
 * 
                for(let i = 0;i<5;++i) {
                    forward = game.map.get(x+d,y);
                    backward = game.map.get(x-d,y);
                    center = game.map.get(x,y);
                    if ( !forward.isSolid ) {
                        x+=d;
                        break;
                    } else if (!backward.isSolid) {
                        d*=-1;
                        x+=d;
                        break;                        
                    } else if (!center.isSolid) {
                        break;
                    }
                }
 */