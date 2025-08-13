"use client"

import { useEffect, useRef } from "react"
import { GameAnimations } from "@/lib/animations"

export function Hero3DScene() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create floating particles
    if (particlesRef.current) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div")
        particle.className = "particle"
        particle.style.left = `${Math.random() * 100}%`
        particle.style.animationDelay = `${Math.random() * 10}s`
        particle.style.animationDuration = `${8 + Math.random() * 4}s`

        const colors = ["#7042f8", "#00d4ff", "#ff0080"]
        particle.style.color = colors[Math.floor(Math.random() * colors.length)]

        particlesRef.current.appendChild(particle)
      }
    }

    // Initialize 3D animations
    if (sceneRef.current) {
      GameAnimations.animateFloat(sceneRef.current, 30)
    }
  }, [])

  return (
    <div ref={sceneRef} className="absolute inset-0 scene-3d overflow-hidden">
      {/* Particle Field */}
      <div ref={particlesRef} className="particle-field" />

      {/* 3D Grid Background */}
      <div className="absolute inset-0 grid-3d opacity-20" />

      {/* Floating 3D Cubes */}
      <div className="absolute top-1/4 left-1/4 floating-3d">
        <div className="cube-3d animate-rotate-3d text-primary">
          <div className="cube-face cube-front wireframe" />
          <div className="cube-face cube-back wireframe" />
          <div className="cube-face cube-right wireframe" />
          <div className="cube-face cube-left wireframe" />
          <div className="cube-face cube-top wireframe" />
          <div className="cube-face cube-bottom wireframe" />
        </div>
      </div>

      <div className="absolute top-3/4 right-1/4 floating-3d-delayed">
        <div className="cube-3d animate-rotate-3d text-secondary" style={{ animationDirection: "reverse" }}>
          <div className="cube-face cube-front wireframe" />
          <div className="cube-face cube-back wireframe" />
          <div className="cube-face cube-right wireframe" />
          <div className="cube-face cube-left wireframe" />
          <div className="cube-face cube-top wireframe" />
          <div className="cube-face cube-bottom wireframe" />
        </div>
      </div>

      <div className="absolute top-1/2 right-1/3 floating-3d">
        <div className="cube-3d animate-rotate-3d text-accent" style={{ animationDelay: "-5s" }}>
          <div className="cube-face cube-front wireframe" />
          <div className="cube-face cube-back wireframe" />
          <div className="cube-face cube-right wireframe" />
          <div className="cube-face cube-left wireframe" />
          <div className="cube-face cube-top wireframe" />
          <div className="cube-face cube-bottom wireframe" />
        </div>
      </div>

      {/* Holographic Panels */}
      <div className="absolute top-1/3 left-1/2 w-32 h-48 hologram border border-primary/30 transform -rotate-12 floating-3d" />
      <div className="absolute bottom-1/3 right-1/2 w-40 h-32 hologram border border-secondary/30 transform rotate-45 floating-3d-delayed" />

      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-primary animate-matrix-rain"
            style={{
              left: `${(i * 5) % 100}%`,
              height: "100px",
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Geometric Wireframes */}
      <div className="absolute top-1/4 right-1/4 w-24 h-24 border border-accent/40 transform rotate-45 floating-3d">
        <div className="absolute inset-2 border border-accent/30 transform -rotate-45" />
        <div className="absolute inset-4 border border-accent/20 transform rotate-45" />
      </div>

      <div className="absolute bottom-1/4 left-1/3 w-32 h-32 border border-primary/40 rounded-full floating-3d-delayed">
        <div className="absolute inset-2 border border-primary/30 rounded-full transform rotate-45" />
        <div className="absolute inset-4 border border-primary/20 rounded-full transform -rotate-45" />
      </div>
    </div>
  )
}
