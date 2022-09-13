var canvas = document.querySelector('canvas')
var sec = document.querySelector('section')
var placar = document.getElementById('placar')
let buttonsMove = document.getElementsByClassName('button-move')
let fs = document.getElementById('fullscreen')
let dicio = document.getElementById('dicio')
let blocoPalavra = document.getElementById('palavra')
let blocoSignificado = document.getElementById('significado-dicio')
let body = document.body
let endScreen 
canvas.width = sec.clientWidth
canvas.height = sec.clientHeight


window.onresize = () => {
   canvas.width = document.body.clientWidth
   canvas.height = document.body.clientHeight
   player.playerWidth = 10 / 100 * canvas.height
   player.playerHeight = 5 / 100 * canvas.height
}
document.getElementById('fullscreen').onclick = () => fullScreen()
document.getElementById('continuar-jogo').onclick = () => continuarJogo()
function fullScreen(){
   if(fs.getAttribute("fs") == 'false'){
      openFullscreen()
      fs.setAttribute('fs', 'true')
   } else{
      closeFullscreen()
      fs.setAttribute('fs', 'false')
   }
}
function openFullscreen() {
  if (body.requestFullscreen) {
    body.requestFullscreen();
  } else if (body.webkitRequestFullscreen) { /* Safari */
    body.webkitRequestFullscreen();
  } else if (body.msRequestFullscreen) { /* IE11 */
    body.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
      document.exitFullscreen()
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

var c = canvas.getContext('2d')
var imgCat = new Image()
imgCat.src = 'imagens/cat.png'

function is_touch_device() {  
    try {  
      document.createEvent("TouchEvent");  
      return true;  
    } catch (e) {  
      return false;  
    }  
  }

if(!is_touch_device()){
   document.getElementById("controls").style.display = "none"
   document.getElementById("shot").style.display = "none"
}

let pontuacao = 0
var perdeu = 0;
var mortes = 0;
var v = false;
var tocou = false;
function getRandom(max, min) {
   return Math.floor(Math.random() * (max - min + 1) + min)
}
let colorArray = [
   'blue',
   'yellow',
   'green',
   'red',
   'white',
   'grey'
]

window.addEventListener("keyup", function(e) {

   const keyUp = e.code
   const moveFalse = accptedMovesUp[keyUp]
   if(moveFalse){
      moveFalse()
   }
})
window.addEventListener("keydown", function(e) {

   const keyPressedDown = e.code;
   const moveTrue = accptedMovesDown[keyPressedDown];
   if(moveTrue){
      moveTrue()
   }
})

buttonsMove = Array.from(buttonsMove)
buttonsMove.forEach(addTouchStart)
buttonsMove.forEach(addTouchEnd)

addTouchStart(document.getElementById('shot'))

function addTouchStart(e){
   e.ontouchstart = () =>{
      const keyPressedDown = e.getAttribute('key')
      const moveTrue = accptedMovesDown[keyPressedDown]
      if(moveTrue){
         moveTrue()
      }
   }
}

function addTouchEnd(e){
   e.ontouchend = () =>{
      const keyPressedUp = e.getAttribute('key')
      const moveFalse = accptedMovesUp[keyPressedUp]
      if(moveFalse){
         moveFalse()
      }
   }
}

const accptedMovesUp = {
   KeyD(){
      player.moveDireita = false;
   },
   KeyA(){
      player.moveEsquerda = false;
   },
   KeyW(){
      player.moveCima = false;
   },
   KeyS(){
      player.moveBaixo = false;
   }
   
}
const accptedMovesDown = {
   KeyD(){
      player.moveDireita = true;
   },
   KeyA(){
      player.moveEsquerda = true;
   },
   KeyW(){
      player.moveCima = true;
   },
   KeyS(){
      player.moveBaixo = true;
   },
   Space(){
      if(bala.length < 2){
         makeBullet()
      }
   }
}


let palavraEmCena = false
let indexPalavraAtual = 0
let palavras = [
   {'palavra': 'blue', 'significado': 'azul'}
]
function mostarPalavra(){
   palavraEmCena = true
   cancelAnimationFrame(animationID)
   if(indexPalavraAtual >= 0){
      document.getElementById('fim-jogo').style.display = 'flex'
      closeFullscreen()
      /*palavras.forEach(element => {
         let vocabulario = document.createElement('div')
         let h2 = document.createElement('h2')
         h2.innerText = element.palavra
         h2.classList.add('palavra')
         let p = document.createElement('p')
         p.innerText = element.significado
         p.classList.add('significado')
         vocabulario.appendChild(h2)
         vocabulario.appendChild(p)
         vocabulario.className = 'vocabulario'
         document.getElementById('fim-jogo-conteiner').insertBefore(vocabulario, document.getElementById('pontuacao-conteiner'))
      }) */
      if(is_touch_device()){
         document.getElementById('pontuacao-conteiner').innerHTML = 'Pontuação: ' + mortes
      }
   }else{
      blocoPalavra.innerText = palavras[indexPalavraAtual].palavra
      blocoSignificado.innerText = palavras[indexPalavraAtual].significado
      dicio.style.display = 'flex'
      dicio.style.opacity = 1
   }

}
function continuarJogo(){
   indexPalavraAtual += 1
   dicio.style.opacity = 0
   dicio.style.display = 'none'
   setTimeout(() => {
      animate()
   }, 1000)
}

let sequencia = 0
function verify(ballx,bally,radius){
   var centerx = Math.abs(player.x + player.playerWidth / 2);
   var centery = Math.abs(player.y + player.playerHeight / 2);
   var centerbx = Math.abs(ballx + 40);
   var centerby = Math.abs(bally + 40);
   var vx = Math.abs(centerx - centerbx);
   var vy = Math.abs(centery - centerby);
   if(vx < radius + player.playerWidth/2.5 && vy < radius + player.playerHeight/2.5){
      for(let i = 0; i < 20; i++){
         destrocos.push(new Destroco(centerbx + getRandom(40,-40), centerby + getRandom(40,-40)))
      }
      sequencia = 0
      mortes++;
      placar.innerHTML = 'MORTES: '+ mortes;
      perdeu++;
      v = true;
   }else{
      v = false;
   }
   return v;
}

function verifyEnemy(meteorX, meteorY, meteorWidth, meteorHeight){
   meteorHeight = meteorHeight / 100 * canvas.height
   meteorWidth = meteorWidth / 100 * canvas.height
      for(l = 0; l < bala.length; l++){
         if (meteorX < bala[l].x + bala[l].width &&
            meteorX + meteorWidth > bala[l].x &&
            meteorY < bala[l].y + bala[l].height &&
            meteorY + meteorHeight > bala[l].y) {
             // collision detected!
            vb = true
            bala.splice(l,1)
            sequencia++
            if(sequencia >= 0){
               mostarPalavra()
               if((Math.floor(getRandom(3, 2))) == 2){
                  makeNyan()
               }
               sequencia = 0
            }
            //if(Math.floor(getRandom(3, 0) === 2)){
               
            //}
            for(let i = 0; i < 20; i++){
               destrocos.push(new Destroco(meteorX + meteorWidth / 2 + getRandom(40,-40), meteorY + meteorHeight / 2 + getRandom(40,-40)))
            }
            l--;
            return vb;
         }
      }
}


let bala = []

function makeBullet(){
   bala.push(new Bullet(player.x + player.playerWidth / 2, player.y + player.playerHeight / 2))
}
var imgBullet = new Image()
imgBullet.src = 'imagens/spell.png'

class Bullet{
   constructor(x, y){
      this.x = x
      this.y = y
      this.dx = 20 
      this.width = 3 / 100 * canvas.height
      this.height = 3 / 100 * canvas.height
   }
   draw(){
      c.beginPath()
      c.drawImage(imgBullet, this.x, this.y, this.width,this.height)
      c.fill()
   }
   update(){
      this.x += this.dx
      this.draw()
   }
}
class Player{
   constructor(){
      this.x = 80
      this.y = canvas.height /2
      this.playerWidth = 10 / 100 * canvas.height
      this.playerHeight = 5 / 100 * canvas.height
      this.moveCima = false
      this.moveBaixo = false
      this.moveDireita = false
      this.moveEsquerda = false
      this.dy = 3
      this.dx = 3
   }
   
   draw(){
      c.drawImage(imgCat, this.x, this.y, this.playerWidth, this.playerHeight)
   }
   update(){
      if(this.moveCima && this.y > 0){
         this.y -= Math.floor(this.dy / 300 * canvas.height)
      }
      if(this.moveBaixo && this.y + this.playerHeight + this.dy < canvas.height){
         this.y += Math.floor(this.dy / 300 * canvas.height)
      }
      if(this.moveDireita && this.x + this.playerWidth + this.dx < canvas.width){
         this.x += Math.floor(this.dx / 300 * canvas.height)
      }
      if(this.moveEsquerda && this.x > 0){
         this.x -= Math.floor(this.dx / 300 * canvas.height)
      }
      this.draw()
   }
}
let destrocos = [];
class Destroco{
   constructor(x,y){
      this.x = x;
      this.y = y;
      this.dx = 4;
      this.color = colorArray[Math.floor(getRandom(7,5))];
   }
   draw(){
      c.beginPath();
      c.fillStyle = this.color;
      c.fillRect(this.x, this.y, 5, 5);
      c.fill();
   }
   update(){
      this.x += -this.dx;
      this.draw();
   }
}
function makeRastro(){
   for(let i = 0; i < 1; i++){
      var x = player.x
      var y = player.y + player.playerHeight / 1.3 + getRandom(4,-4)
      rastro.push(new Rastro(x,y))
   }
}

class Rastro {
   constructor(x,y){
      this.x = x;
      this.yAntigo = y;
      this.y = y;
      this.dx = -6;
      this.dy = getRandom(6,-6);
      
      this.color = colorArray[Math.floor(getRandom(4,0))];
      
   }
   draw(){
      c.beginPath();
      c.fillStyle = this.color;
      c.fillRect(this.x, this.y, 0.5 / 100 * canvas.height, 0.5 / 100 * canvas.height);
      c.fill();
   }
   update(){
      if(this.y > this.yAntigo + getRandom(10,-4) || this.y < this.yAntigo - getRandom(10, -4)){
         this.dy = -this.dy;
      }else{
         this.dy += getRandom(5,-5);
      }
      this.x += this.dx;
      this.y += this.dy;      
      this.draw();
   }
}

let rastro = []
let nyan = []
let rastronyan = []
class rastroNyan{
   constructor(x,y,color){
      this.x = x + 20
      this.y = y + 15 + getRandom(5,-5)
      this.dx = -2
      this.color = color
   }
   draw(){
      c.fillStyle = this.color
      c.fillRect(this.x,this.y,1,1)
   }
   update(){
      this.x += this.dx
      this.draw()
   }
}
function makeNyan(){
   var y = getRandom(canvas.height - 30, 30)
   var imgNyan = new Image();
   imgNyan.src = 'imagens/nyan/nyan.png'
   nyan.push(new Nyan(y, imgNyan));
}
class Nyan{
   constructor(y, imgNyan){
      this.x = canvas.width + 500;
      this.dx = -3;
      this.y = y;
      this.imgNyan = imgNyan;
   }
   draw(){
      c.drawImage(this.imgNyan, this.x, this.y, 40, 30);
   }
   update(){
      this.x += this.dx;
      if(Math.floor(getRandom(4,0)) == 2){
         rastronyan.push(new rastroNyan(this.x, this.y, colorArray[Math.floor(getRandom(4,0))]));
      }
      this.draw();

   }
}
class Neve{
    constructor(x,y,dx,dy,radius){
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
   draw(){
      c.beginPath();
      c.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
      c.fillStyle = 'white';
      c.fill();
      
   }
   update(){
      this.draw();
      this.x += this.dx;
    }
}
function makeEnemy(){
   if(enemies.length < 9){
      for(let i = 0; i < 9; i++){
         let x = getRandom(canvas.width + 2000, canvas.width)
         let y = getRandom(canvas.height - 60, 60)
         let dx = getRandom(-2,-3)
         let dy
         do {
            dy = getRandom(1,-1)
         } while (dy == 0)
         let meteorArray = ['imagens/1.png','imagens/2.png','imagens/3.png','imagens/4.png','imagens/5.png','imagens/6.png','imagens/7.png','imagens/8.png','imagens/9.png','imagens/10.png'];
         let imgMeteor = new Image()
         imgMeteor.src = meteorArray[i]
         enemies.push(new Enemy(x, y, dx, dy, imgMeteor))
      }
   }
}

class Enemy{
   constructor(x,y,dx,dy, imgMeteor){
      this.x = x
      this.y = y
      this.dx = dx
      this.dy = dy
      this.radius = 40
      this.meteorWidth = 10
      this.meteorHeight = 10 
      this.imgMeteor = imgMeteor
   }
   draw(){
      c.drawImage(this.imgMeteor, this.x, this.y, this.meteorWidth / 100 * canvas.height, this.meteorHeight / 100 * canvas.height)
   }
   update(){
      this.v = verify(this.x,this.y ,this.radius, this.dx, this.dy)
      if(bala.length > 0){
         this.vb = verifyEnemy(this.x, this.y, this.meteorWidth, this.meteorHeight)
      }
      if (this.v === true && tocou === false){
         tocou = true
         return true
      }
      if(this.y + this.meteorHeight / 100 * canvas.height>= canvas.height || this.y + Math.floor(this.dy / 300 * canvas.height) <= 0){
         this.dy = -this.dy
      }

      this.x += Math.floor(this.dx / 300 * canvas.width)
      this.y += Math.floor(this.dy / 200 * canvas.height)
      
      this.draw()
      return this.vb
   }
}

let neve = []
let enemies = []
let player = new Player()

function delBall(){
   enemies.splice(0,2)
}

function init(){
   placar.innerHTML = 'MORTES: '+ mortes
   if(neve.length < 50){
      for (let i  = 0; i <= 4; i++){
         var radius = getRandom(0.04, 0.02)
         var x = getRandom(canvas.width - radius, radius)
         var y = getRandom(canvas.height - radius, radius)
         var dx = getRandom(-2,-1)
         
         neve.push(new Neve(x,y,dx,0,radius))
      }
   }
}

animationID = undefined
function animate(){
       animationID = requestAnimationFrame(animate)
         c.clearRect(0,0,sec.clientWidth, sec.clientHeight)
         
         for(let i = 0; i < neve.length; i++){
            neve[i].update()
            if(neve[i].x < 0){
               neve.splice(i,1)
               init()
            }
         }
         
         if(rastronyan.length > 0){
            for(let i = 0; i < rastronyan.length; i++){
               rastronyan[i].update()
               
               if(rastronyan[i].x < -2){
                  rastronyan.splice(i,1)
               }
            }
         }
         if(nyan.length > 0){
            for(let i = 0; i < nyan.length; i++){
               nyan[i].update()
               if(nyan[i].x < -30){
                  nyan.splice(i,1)
               }
            }
         }
         for(let i = 0; i < rastro.length; i++){
            rastro[i].update()
            if(rastro[i].x < 0){
               rastro.splice(i,1)
            }
         }
   
         if(destrocos.length > 0){
            for(let i = 0; i < destrocos.length; i++){
               destrocos[i].update()
               if(destrocos[i].x < 0){
                  destrocos.splice(i,1)
               }
            }
         }
   
         for(let i = 0; i < enemies.length; i++){
            enemies[i].update()
            if(enemies[i].x < -60 || enemies[i].v === true || enemies[i].vb === true){
               
               //ball.splice(i,1)
               enemies[i].x = getRandom(canvas.width + 1500, canvas.width)
               enemies[i].y = getRandom(canvas.height, 60)
               //i--
               //makeEnemy()
            }
   
         }
         if(bala.length > 0){
            for(let i = 0; i < bala.length; i++){
               bala[i].update()
               if(bala[i].x > canvas.width){
                  bala.splice(i,1)
               }
            }
         }         
         player.update();
         makeRastro();
      }

init()
makeEnemy()
makeRastro()
animate()

document.getElementById("enviar-pontuacao-but").addEventListener("click", (e) =>{
   e.preventDefault()
   let ipServer = document.getElementById('ip-server').value.trim()
   let nomeJogador = document.getElementById('player-name').value.trim()
   if(ipServer && nomeJogador){
      var request = new XMLHttpRequest()
      var path = `http://${ipServer}:3000` // enter your server ip and port number
      request.open("POST", path, true); // true = asynchronous
      request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
      request.send (`{"nome":"${nomeJogador}","mortes":${mortes}}`)
      request.onload = () => {
         if (request.readyState === request.DONE) {
            if (request.status === 200) {
               console.log(request.response)
               if(request.responseText === 'recebido'){
                  document.getElementById('fim-jogo-conteiner').style.display = 'none'
                  document.getElementById('fim-jogo-creditos').style.display = 'block'
               }
            } else{
               console.log('envio falhou')
            }
         }
      }
      request.onerror = () =>{
         window.alert('Falha ao enviar pontuação (Falar com Gabriel)')
      }
   } else{
      window.alert('Digite o seu nome e o IP do servidor')
   }
})