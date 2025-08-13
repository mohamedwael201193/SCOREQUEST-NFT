class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {}
  private enabled = true
  private initialized = false

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeSounds()
    }
  }

  private async initializeSounds() {
    try {
      // For now, we'll create silent audio objects to prevent errors
      // In the future, you can add actual sound files to the /public/sounds/ directory
      const soundNames = ["hit", "miss", "bonus", "penalty", "victory", "gameOver", "combo", "tick"]

      soundNames.forEach((name) => {
        // Create a silent audio element as placeholder
        const audio = new Audio()
        audio.volume = 0.5
        audio.preload = "none"
        this.sounds[name] = audio
      })

      this.initialized = true
    } catch (error) {
      console.warn("Sound initialization failed:", error)
      this.enabled = false
    }
  }

  play(soundName: string, volume = 0.5) {
    if (!this.enabled || !this.initialized || !this.sounds[soundName]) {
      return
    }

    try {
      // For now, just log the sound that would be played
      // This prevents errors while keeping the game functional
      console.log(`🔊 Playing sound: ${soundName} at volume ${volume}`)

      // Uncomment this when you add actual sound files:
      // const sound = this.sounds[soundName].cloneNode() as HTMLAudioElement
      // sound.volume = volume
      // sound.play().catch(() => {
      //   // Ignore autoplay restrictions
      // })
    } catch (error) {
      console.warn(`Failed to play sound ${soundName}:`, error)
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  isEnabled() {
    return this.enabled
  }
}

export const soundManager = new SoundManager()
