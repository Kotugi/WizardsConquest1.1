// https://youtu.be/C4_iRLlPNFc?t=12244

"use strict";
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 768

ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.width, canvas.height)

//console.log(placementTilesData)
const placementTilesData2D = []

for (let i = 0; i < placementTilesData.length; i += 20) {
  placementTilesData2D.push(placementTilesData.slice(i, i + 20))
}

const placementTiles = []

placementTilesData2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 263) {
      placementTiles.push(new PlacementTile({
        position: {
          x: x * 64,
          y: y * 64
        }
      }))
    }
  })
})

//console.log(placementTiles)

const image = new Image()

image.onload = () => {
  animate()
}
image.src = 'assets/mappest.png'

const enemies = []
let enemyCount = 3
function spawnenemies(spawnCount){
  for (let i = 1; i <= spawnCount; i++) {
  const xOffset = i * 200
  enemies.push(
    new Enemy({
      position: { x: waypoints[0].x - xOffset, y: waypoints[0].y}
    })
   )
  }
}
spawnenemies(enemyCount)
const buildings = []
let activeTile = undefined
let heart = 10
let coins = 200
function animate() {
  const animationId = requestAnimationFrame(animate)
  
  ctx.drawImage(image, 0, 0)
for (let i = enemies.length - 1; i >= 0; i--){
  const enemy = enemies[i]
    enemy.update()

      if (enemy.position.x > canvas.width){
    heart -= 1
    enemies.splice(i, 1)
    document.querySelector('#hearts').innerHTML = heart
    console.log(heart)
    if (heart === 0) {
      console.log("Game Over")
      cancelAnimationFrame(animationId)
      document.querySelector('#gameOver').style.display = 'flex'
    }
  }
  }

  
  
   if(enemies.length===0){
          enemyCount += 2
          spawnenemies(enemyCount)
        }

  
  placementTiles.forEach(tile => {
    tile.update(mouse)
  })

  buildings.forEach((building) => {
    building.update()
    building.target = null
    const validEnemies = enemies.filter(enemy=>{
        const xDifference = enemy.center.x - building.center.x
      const yDifference = enemy.center.y - building.center.y
      const distance = Math.hypot(xDifference,yDifference)
      return distance < enemy.radius + building.radius
    })
    building.target = validEnemies[0]
   // console.log(  building.target = validEnemies[0])
    
  for (let i = building.projectiles.length-1; i >= 0; i--){
    const projectile = building.projectiles[i]
      projectile.update()

      const xDifference = projectile.enemy.center.x - projectile.position.x
      const yDifference = projectile.enemy.center.y - projectile.position.y
      const distance = Math.hypot(xDifference,yDifference)
    // hit detection for enemy
      if(distance < projectile.enemy.radius + projectile.radius){
        projectile.enemy.health -= 20
        if (projectile.enemy.health <=0){
         const enemyIndex =  enemies.findIndex((enemy)=>{
            return projectile.enemy === enemy
          })
          if (enemyIndex > -1){
            enemies.splice(enemyIndex, 1)
            coins += 25
            document.querySelector('#coins').innerHTML = coins
          }
        }
       
        building.projectiles.splice(i, 1)
      }
      console.log(distance)
  }
  })
}

const mouse = {
  x: undefined,
  y: undefined
}

canvas.addEventListener('click', (event) => {
  if (activeTile && !activeTile.isOccupied&& coins - 50 >=0) {
    coins -= 50
    document.querySelector('#coins').innerHTML=coins
    buildings.push(
      new Building({
        position: {
          x: activeTile.position.x,
          y: activeTile.position.y
        }
      })
    )
    activeTile.isOccupied = true
  }
  //console.log(buildings)
})

window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY

  activeTile = null
  for (let i = 0; i < placementTiles.length; i++) {
    const tile = placementTiles[i]
    if (
      mouse.x > tile.position.x && 
      mouse.x < tile.position.x + tile.size && 
      mouse.y > tile.position.y && 
      mouse.y < tile.position.y + tile.size
    ) {
      activeTile = tile
      break
    }
  }
})