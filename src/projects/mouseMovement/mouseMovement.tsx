import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import "./mouseMovement.css"

export default function MouseMovement() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const context = c.getContext("2d")
    if (!context) return

    // create plus shape canvas
    const canvas2 = document.createElement("canvas")
    const canvas2Context = canvas2.getContext("2d")!
    canvas2.width = canvas2.height = 20
    canvas2Context.lineWidth = 2
    canvas2Context.beginPath()
    canvas2Context.moveTo(10, 0)
    canvas2Context.lineTo(10, 20)
    canvas2Context.moveTo(0, 10)
    canvas2Context.lineTo(20, 10)
    canvas2Context.stroke()

    function Plus(this: any) {
      this.x = 0
      this.y = 0
      this.left = 0
      this.top = 0
      this.width = 0
      this.height = 0
      this.scale = 0.5
    }

    Plus.prototype.draw = function (ctx: CanvasRenderingContext2D) {
      ctx.setTransform(this.scale, 0, 0, this.scale, this.left + this.x, this.top + this.y)
      ctx.drawImage(canvas2, -10, -10, 20, 20)
    }

    const gridLength = 9
    const signs: any[][] = []
    const mouse = { x: 0, y: 0 }
    let mouseMoved = false
    let mouseOver = false

    for (let i = 0; i < gridLength; i++) {
      signs[i] = []
      for (let j = 0; j < gridLength; j++) {
        const sign = new (Plus as any)()
        sign.left = c.width / (gridLength + 1) * (i + 1)
        sign.top = c.height / (gridLength + 1) * (j + 1)
        sign.width = 10
        sign.height = 10
        signs[i][j] = sign
      }
    }

    function draw() {
      if (!context) return
      if (!c) return

      if (mouseOver && mouseMoved) {
        calculateIconPosition()
        mouseMoved = false
      }

      context.clearRect(0, 0, c.width, c.height)
      context.save()
      for (let i = 0; i < gridLength; i++) {
        for (let j = 0; j < gridLength; j++) {
          const sign = signs[i][j]
          sign.draw(context)
        }
      }
      context.restore()
    }

    function calculateIconPosition() {
      for (let i = 0; i < gridLength; i++) {
        for (let j = 0; j < gridLength; j++) {
          const sign = signs[i][j]
          let radius = 20
          const dx = mouse.x - sign.left
          const dy = mouse.y - sign.top
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const angle = Math.atan2(dy, dx)

          if (dist < radius) {
            radius = dist
            gsap.to(sign, { duration: 0.3, scale: 1 })
          } else {
            gsap.to(sign, { duration: 0.3, scale: 0.5 })
          }

          gsap.to(sign, {
            duration: 0.3,
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
          })
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = c.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouseMoved = true
    }

    const handleEnter = () => {
      mouseOver = true
    }

    const handleLeave = () => {
      mouseOver = false
      for (let i = 0; i < gridLength; i++) {
        for (let j = 0; j < gridLength; j++) {
          const sign = signs[i][j]
          gsap.to(sign, { duration: 0.3, x: 0, y: 0, scale: 0.5 })
        }
      }
    }

    c.addEventListener("mousemove", handleMouseMove)
    c.addEventListener("mouseenter", handleEnter)
    c.addEventListener("mouseleave", handleLeave)

    gsap.ticker.add(draw)

    return () => {
      c.removeEventListener("mousemove", handleMouseMove)
      c.removeEventListener("mouseenter", handleEnter)
      c.removeEventListener("mouseleave", handleLeave)
      gsap.ticker.remove(draw)
    }
  }, [])

  return (
    <div className="mouse-movement">
      <h1>Mouse Movement Project (transform/move background elements based on where the mouse is)</h1>
      <canvas ref={canvasRef} width={500} height={500}></canvas>
    </div>
  )
}
