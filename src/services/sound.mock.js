const volumeSettings = {
  sound: 0.6,
  music: 0.4,
  master: 1,
};

export const SoundService = (window.SoundService = {
  SOUNDS: {},

  getVolume() {
    return volumeSettings;
  },

  getSoundVolume() {
    return volumeSettings.sound * volumeSettings.master;
  },
  getMusicVolume() {
    return volumeSettings.music * volumeSettings.master;
  },

  adjustSoundVolume(value) {
    volumeSettings.sound = value;
  },
  adjustMusicVolume(value) {
    volumeSettings.music = value;
  },
  adjustMasterVolume(value) {
    volumeSettings.master = value;
  },

  playSound() {},

  playMusic(musicFile) {},
});
