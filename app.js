const canvas=document.getElementById("canvas")
const c=canvas.getContext("2d")

c.canvas.background="black"

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
        this.speed=12;
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
        /*c.beginPath();
        c.arc(0,0,this.size/2,0,Math.PI*2);
        c.stroke();*/
        c.restore();
    }
    update(){
        this.angle=Math.atan2(this.my-this.y, this.mx-this.x);

        if( this.controls.includes("left") ){
            this.x-=this.speed;
        }
        if( this.controls.includes("right") ){
            this.x+=this.speed/1.5;
        }
        if( this.controls.includes("up") ){
            this.y-=this.speed/1.2;
        }
        if( this.controls.includes("down") ){
            this.y+=this.speed/1.2;
        }

        if(this.x <0){
            this.x=0;
        }if(this.y <0){
            this.y=0;
        }if(this.x > innerWidth){
            this.x=innerWidth;
        }if(this.y > innerHeight){
            this.y=innerHeight;
        }
    }
}

class Projectile{
    constructor(x,y,angle){
        this.x=x;
        this.y=y;
        this.angle=angle;
        this.size=10;
        this.speed=15 + 4* level;
    }
    draw(){
        this.update()
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI*2);
        c.fillStyle="#f7df88"
        c.fill();
    }
    update(){
        this.x+=this.speed*Math.cos(this.angle);
        this.y+=this.speed*Math.sin(this.angle);
    }
}

class Enemy{
    constructor(type){
        this.x=innerWidth;
        this.y=Math.random()*innerHeight;
        this.speed=8 + 4*level;
        this.type=type;
        this.hearts=type;
        this.size=80;
    }
    draw(){
        this.update();
        let img=new Image();
        img.src=`svgs/${this.type}.svg`;
        c.save();
        c.translate(this.x,this.y);
        c.drawImage(img,-this.size/2,-this.size/2,this.size,this.size);
        /*c.beginPath();
        c.arc(0,0,this.size/2,0,Math.PI*2);
        c.stroke();*/
        c.restore();
    }
    update(){
        this.x-=this.speed;
    }
}

var projectiles=[];
var enemies=[];
var score=0;

addEventListener("click", () => {
    projectiles.push(new Projectile(player.x, player.y, player.angle))
})
var player=new Player();

addEventListener("keydown", (e)=>{
    if(e.key=="a" || e.key=="ArrowLeft" || e.key=="A"){
        if( !player.controls.includes("left") ){
            player.controls.push("left")
        }
    }else if(e.key=="w" || e.key=="ArrowUp" ||e.key=="W"){
        if( !player.controls.includes("up") ){
            player.controls.push("up")
        }
    }else if(e.key=="s" || e.key=="ArrowDown" || e.key=="S"){
        if( !player.controls.includes("down") ){
            player.controls.push("down")
        }
    }else if(e.key=="d" || e.key=="ArrowRight" || e.key=="D"){
        if( !player.controls.includes("right") ){
            player.controls.push("right")
        }
    }
})

addEventListener("keyup", (e)=>{
    if(e.key=="a" || e.key=="ArrowLeft" || e.key=="A"){
        if( player.controls.includes("left") ){
            player.controls.splice(player.controls.findIndex( (e) => e=="left" ),1)
        }
    }else if(e.key=="w" || e.key=="ArrowUp" ||e.key=="W"){
        if( player.controls.includes("up") ){
            player.controls.splice(player.controls.findIndex((e) => e=="up"),1)
        }
    }else if(e.key=="s" || e.key=="ArrowDown" ||e.key=="S"){
        if( player.controls.includes("down") ){
            player.controls.splice(player.controls.findIndex((e) => e=="down"),1)
        }
    }else if(e.key=="d" || e.key=="ArrowRight" || e.key=="D"){
        if( player.controls.includes("right") ){
            player.controls.splice(player.controls.findIndex((e) => e=="right"),1)
        }
    }
})

function Cleanup(){
    for (let i=0; i<projectiles.length; i++){
        let x=projectiles[i].x;
        let y=projectiles[i].y;
        let flag=0;

        if(x <0){
            flag=1;
        }if(y <0){
            flag=1;
        }if(x > innerWidth){
            flag=1;
        }if(y > innerHeight){
            flag=1;
        }

        if(flag){
            projectiles.splice(i,1)
            i--;
        }
    }
    if(enemies.length){
        if(enemies[0].x<0 ){
        enemies.splice(0,1)
        }
    }
}

var reqId;

function play(){
    reqId=requestAnimationFrame(play);
    c.clearRect(0,0,innerWidth,innerHeight)

    Cleanup();
    projectiles.forEach( (e) => {
        e.draw();
    })

    enemies.forEach( (e) =>{
        e.draw();
    })

    player.draw()

    checkCollisions()
    updateScore()
    isPlayerLive()

}

function start(){
    document.getElementById("start-box").style.display="none"
    resize();
    player=new Player();
    projectiles=[];
    enemies=[];
    genEnemies();
    level=0;
    secs=0;
    score=0;
    time();
    play();    
}

function restart(){
    document.getElementById("end-box").style.display="none"
    resize();
    player=new Player();
    projectiles=[];
    enemies=[];
    genEnemies();
    level=0;
    secs=0;
    score=0;
    time();
    play(); 
}

function updateScore(){
    document.getElementById("score").innerHTML=`SCORE ${score}`
}

var level=0;

var EnemySpawn;
function genEnemies(){
        enemies.push( new Enemy(1) )
        
        EnemySpawn=setTimeout(() => {
            genEnemies();
        }, 1000);
    
}

function checkCollisions(){
    enemies.forEach( (e)=>{
        projectiles.forEach((p)=>{
            let d=Math.sqrt(Math.pow(e.x-p.x,2)+Math.pow(e.y-p.y,2))
            if( d < e.size+p.size ){
                e.hearts-=1;
                projectiles.splice( projectiles.findIndex( (d) => d==p) , 1)
                if(e.hearts==0){
                    enemies.splice( enemies.findIndex( (d) => d==e) , 1)
                    d=Math.sqrt(Math.pow(e.x-player.x,2)+Math.pow(e.y-player.y,2))
                    console.log(d/player.size)
                    if (d<player.size*4){
                        score+=50;
                    }else if(d<player.size*7){
                        score+=100;
                    }else{
                        score+=300;
                    }
                }

            }
        })
    })
}

function isPlayerLive(){
    enemies.forEach((e)=>{
        let d=Math.sqrt(Math.pow(e.x-player.x,2)+Math.pow(e.y-player.y,2))
        if( d < (e.size+player.size)/2 ){
            terminate();
        }
    })
}

var secs=0;
var timeId;
function time(){
    secs+=1;
    let sec=secs%60;
    let min=Math.floor(secs/60);
    min= min < 10 ? '0'+ min : min;
    sec= sec < 10 ? '0'+ sec : sec;
    document.getElementById("time").innerHTML=`TIME - ${min}:${sec}`;
    if(secs%30==0){
        score+=2000;
        level+=1;
        document.getElementById("level").innerHTML=`LEVEL ${level}`
        player.speed+=5;
    }
    timeId=setTimeout(() => {
        time()
    }, 1000);
}

function terminate(){
    c.fillStyle="rgba(0,0,0,0.1)"
    c.fillRect(0,0,c.canvas.width,c.canvas.height)
    cancelAnimationFrame(reqId)
    clearTimeout(EnemySpawn)
    clearTimeout(timeId)
    document.getElementById("end-box").style.display=""
    if(localStorage.getItem("highscore")==null){
        localStorage.setItem("highscore", score);
    }
    else if(localStorage.getItem("highscore") < score){
        localStorage.setItem("highscore", score)
    }
    document.getElementById("end-score").innerHTML=score;
    document.getElementById("end-highscore").innerHTML=` HIGHSCORE - ${localStorage.getItem("highscore")}`
}
