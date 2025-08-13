"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface Text3DProps {
  children: React.ReactNode
  className?: string
  glitch?: boolean
}

export function Text3D({ children, className = "", glitch = false }: Text3DProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textRef.current && glitch) {
      // Add glitch effect
      const glitchAnimation = () => {
        if (textRef.current) {
          const glitchChance = Math.random()
          if (glitchChance < 0.1) {
            textRef.current.style.transform = `translateX(${Math.random() * 4 - 2}px) translateY(${Math.random() * 2 - 1}px)`
            textRef.current.style.filter = `hue-rotate(${Math.random() * 360}deg)`

            setTimeout(() => {
              if (textRef.current) {
                textRef.current.style.transform = ""
                textRef.current.style.filter = ""
              }
            }, 100)
          }
        }
      }

      const interval = setInterval(glitchAnimation, 200)
      return () => clearInterval(interval)
    }
  }, [glitch])

  return (
    <div
      ref={textRef}
      className={`text-3d preserve-3d ${className}`}
      style={{
        transform: "rotateX(15deg) rotateY(-5deg)",
      }}
    >
      {children}
    </div>
  )
}
