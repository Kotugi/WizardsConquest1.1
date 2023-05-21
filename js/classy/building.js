class Building extends Sprite{
  constructor({ position = { x: 0, y: 0 } }) {
      super({position, imageSrc:"assets/DarkW.png"})
    this.position = position
    this.width = 64
    this.height = 64
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    }
    this.projectiles = []
    this.radius = 250
    this.target 
    this.frames = 0
  }

  draw() {
    ctx.fillStyle = 'blue'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    ctx.beginPath()
    ctx.arc(this.center.x, this.center.y,this.radius,0,Math.PI*2)
    ctx.fillStyle= 'rgba(0,0,255, 0.0)'
    ctx.fill()
  }
  update(){
    super.draw()
    if(this.frames % 100 === 0&& this.target){
      this.projectiles.push(
       new Projectile({
        position: {
          x: this.center.x,
          y: this.center.y
        },
        enemy: this.target
      })
      )
    }
    this.frames++
  }
}