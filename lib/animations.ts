import { gsap } from "gsap"

// GSAP Animation Utilities
export class GameAnimations {
  static initializeGSAP() {
    // Set default ease and duration
    gsap.defaults({ ease: "power2.out", duration: 0.6 })
  }

  // Hero section entrance animation
  static animateHeroEntrance() {
    const tl = gsap.timeline()

    tl.from(".hero-title", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    })
      .from(
        ".hero-subtitle",
        {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.8",
      )
      .from(
        ".hero-description",
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.6",
      )
      .from(
        ".hero-buttons",
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
        },
        "-=0.4",
      )
      .from(
        ".feature-card",
        {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
        },
        "-=0.6",
      )

    return tl
  }

  // Game target spawn animation
  static animateTargetSpawn(element: HTMLElement) {
    gsap.set(element, { scale: 0, rotation: 0 })

    const tl = gsap.timeline()
    tl.to(element, {
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.7)",
    }).to(
      element,
      {
        rotation: 360,
        duration: 2,
        ease: "none",
        repeat: -1,
      },
      0,
    )

    return tl
  }

  // Target hit animation
  static animateTargetHit(element: HTMLElement, isBonus = false) {
    const tl = gsap.timeline()

    if (isBonus) {
      // Bonus target explosion
      tl.to(element, {
        scale: 1.5,
        duration: 0.1,
        ease: "power2.out",
      }).to(element, {
        scale: 0,
        rotation: "+=180",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      })
    } else {
      // Normal target hit
      tl.to(element, {
        scale: 1.2,
        duration: 0.1,
      }).to(element, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      })
    }

    return tl
  }

  // Score popup animation
  static animateScorePopup(element: HTMLElement, points: number) {
    gsap.set(element, { scale: 0, y: 0, opacity: 1 })

    const tl = gsap.timeline()
    tl.to(element, {
      scale: 1.2,
      duration: 0.2,
      ease: "back.out(2)",
    }).to(
      element,
      {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.1",
    )

    return tl
  }

  // Combo animation
  static animateCombo(element: HTMLElement, comboCount: number) {
    const tl = gsap.timeline()

    tl.set(element, { scale: 0, rotation: -10 })
      .to(element, {
        scale: 1.3,
        rotation: 0,
        duration: 0.3,
        ease: "back.out(2)",
      })
      .to(element, {
        scale: 1,
        duration: 0.2,
      })

    // Add shake effect for high combos
    if (comboCount >= 5) {
      tl.to(
        element,
        {
          x: "random(-5, 5)",
          y: "random(-3, 3)",
          duration: 0.1,
          repeat: 5,
          yoyo: true,
        },
        "-=0.2",
      ).to(element, { x: 0, y: 0, duration: 0.1 })
    }

    return tl
  }

  // Game over modal entrance
  static animateModalEntrance(element: HTMLElement, won: boolean) {
    gsap.set(element, { scale: 0, rotation: won ? 0 : 180, opacity: 0 })

    const tl = gsap.timeline()
    tl.to(element, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
    })

    if (won) {
      // Victory confetti effect
      tl.to(
        ".trophy-icon",
        {
          y: -20,
          duration: 0.5,
          ease: "power2.out",
          yoyo: true,
          repeat: 3,
        },
        "-=0.3",
      )
    }

    return tl
  }

  // Particle burst effect
  static createParticleBurst(x: number, y: number, color = "#8b5cf6") {
    const particles: HTMLElement[] = []

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute w-2 h-2 rounded-full pointer-events-none"
      particle.style.backgroundColor = color
      particle.style.left = `${x}px`
      particle.style.top = `${y}px`
      particle.style.zIndex = "1000"

      document.body.appendChild(particle)
      particles.push(particle)

      const angle = (i / 12) * Math.PI * 2
      const distance = 50 + Math.random() * 50
      const endX = x + Math.cos(angle) * distance
      const endY = y + Math.sin(angle) * distance

      gsap.to(particle, {
        x: endX - x,
        y: endY - y,
        opacity: 0,
        scale: 0,
        duration: 0.8 + Math.random() * 0.4,
        ease: "power2.out",
        onComplete: () => {
          document.body.removeChild(particle)
        },
      })
    }
  }

  // Screen shake effect
  static screenShake(intensity = 10) {
    const tl = gsap.timeline()

    tl.to("body", {
      x: `random(-${intensity}, ${intensity})`,
      y: `random(-${intensity / 2}, ${intensity / 2})`,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: "power2.inOut",
    }).to("body", { x: 0, y: 0, duration: 0.1 })

    return tl
  }

  // Neon glow pulse animation
  static animateNeonPulse(element: HTMLElement) {
    gsap.to(element, {
      boxShadow: "0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor",
      duration: 1,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
    })
  }

  // Floating animation for elements
  static animateFloat(element: HTMLElement, amplitude = 20) {
    gsap.to(element, {
      y: -amplitude,
      duration: 2 + Math.random(),
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    })
  }

  // Text typing animation
  static animateTextReveal(element: HTMLElement, text: string) {
    const chars = text.split("")
    element.innerHTML = ""

    chars.forEach((char, i) => {
      const span = document.createElement("span")
      span.textContent = char === " " ? "\u00A0" : char
      span.style.opacity = "0"
      element.appendChild(span)

      gsap.to(span, {
        opacity: 1,
        duration: 0.05,
        delay: i * 0.03,
        ease: "none",
      })
    })
  }
}
