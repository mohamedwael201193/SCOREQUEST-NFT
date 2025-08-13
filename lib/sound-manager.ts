class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {}
  private enabled = true

  constructor() {
    if (typeof window !== "undefined") {
      this.loadSounds()
    }
  }

  private loadSounds() {
    const soundFiles = {
      hit: "/sounds/hit.mp3",
      miss: "/sounds/miss.mp3",
      bonus: "/sounds/bonus.mp3",
      penalty: "/sounds/penalty.mp3",
      victory: "/sounds/victory.mp3",
      gameOver: "/sounds/game-over.mp3",
      combo: "/sounds/combo.mp3",
      tick: "/sounds/tick.mp3",
    }

    Object.entries(soundFiles).forEach(([key, src]) => {
      const audio = new Audio(src)
      audio.preload = "auto"
      audio.volume = 0.5
      this.sounds[key] = audio
    })
  }

  play(soundName: string, volume = 0.5) {
    if (!this.enabled || !this.sounds[soundName]) return

    const sound = this.sounds[soundName].cloneNode() as HTMLAudioElement
    sound.volume = volume
    sound.play().catch(() => {
      // Ignore autoplay restrictions
    })
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  isEnabled() {
    return this.enabled
  }
}

export const soundManager = new SoundManager()
