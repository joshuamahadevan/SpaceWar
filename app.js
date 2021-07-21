const canvas=document.getElementById("canvas")
const c=canvas.getContext("2d")

c.canvas.background="rgba(50,50,50,.8)"

function resize(){
    c.canvas.width=innerWidth-5;
    c.canvas.height=innerHeight-5;
}

resize()

addEventListener("resize", resize);

addEventListener("mousemove", (e) => {
    player.mx=e.clientX;
    player.my=e.clientY;
})

class Player{
    constructor(){
        this.x=innerWidth/2;
        this.y=innerHeight/2;
        this.size=100;
        this.controls=[];
        this.speed=5;
        this.angle=0;
        this.mx=this.x;
        this.my=this.y;
    }
    draw(){
        this.update()
        const img=new Image()
        img.src="svgs/player.svg"
        c.save()
        c.translate(this.x,this.y)
        c.rotate(this.angle+Math.PI/2)
        c.drawImage(img,-this.size/2, -this.size/2, this.size,this.size)
        c.restore();
    }
    update(){
        this.angle=Math.atan2(this.my-this.y, this.mx-this.x);

        if( this.controls.includes("left") ){
            this.x-=this.speed;
        }
        if( this.controls.includes("right") ){
            this.x+=this.speed;
        }
        if( this.controls.includes("up") ){
            this.y-=this.speed;
        }
        if( this.controls.includes("down") ){
            this.y+=this.speed;
        }
    }
}

var projectiles=[];

class Projectile{
    constructor(x,y,angle){
        this.x=x;
        this.y=y;
        this.angle=angle;
        this.speed=7;
    }
    draw(){
        this.update()
        c.beginPath();
        c.arc(this.x, this.y, 10, 0, Math.PI*2);
        c.fillStyle="red"
        c.fill();
    }
    update(){
        this.x+=this.speed*Math.cos(this.angle);
        this.y+=this.speed*Math.sin(this.angle);
    }
}

addEventListener("click", () => {
    projectiles.push(new Projectile(player.x, player.y, player.angle))
})
var player=new Player();

addEventListener("keydown", (e)=>{
    if(e.key=="a" || e.key=="ArrowLeft"){
        if( !player.controls.includes("left") ){
            player.controls.push("left")
        }
    }else if(e.key=="w" || e.key=="ArrowUp"){
        if( !player.controls.includes("up") ){
            player.controls.push("up")
        }
    }else if(e.key=="s" || e.key=="ArrowDown"){
        if( !player.controls.includes("down") ){
            player.controls.push("down")
        }
    }else if(e.key=="d" || e.key=="ArrowRight"){
        if( !player.controls.includes("right") ){
            player.controls.push("right")
        }
    }
})

addEventListener("keyup", (e)=>{
    if(e.key=="a" || e.key=="ArrowLeft"){
        if( player.controls.includes("left") ){
            player.controls.splice(player.controls.findIndex( (e) => e=="left" ),1)
        }
    }else if(e.key=="w" || e.key=="ArrowUp"){
        if( player.controls.includes("up") ){
            player.controls.splice(player.controls.findIndex((e) => e=="up"),1)
        }
    }else if(e.key=="s" || e.key=="ArrowDown"){
        if( player.controls.includes("down") ){
            player.controls.splice(player.controls.findIndex((e) => e=="down"),1)
        }
    }else if(e.key=="d" || e.key=="ArrowRight"){
        if( player.controls.includes("right") ){
            player.controls.splice(player.controls.findIndex((e) => e=="right"),1)
        }
    }
})


function play(){
    requestAnimationFrame(play);
    c.clearRect(0,0,innerWidth,innerHeight)

    
    projectiles.forEach( (e) => {
        e.draw();
    })

    player.draw()
}

play()