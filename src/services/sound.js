import { Howl, Howler } from "howler";
import "./controls.js";
import buttonSound from "../assets/sounds/button-click.mp3";
import travelSound from "../assets/sounds/travel.mp3";
import errorSound from "../assets/sounds/notification-error.mp3";
import notificationSound from "../assets/sounds/notification.mp3";

const lastNotification = {};
const soundSettings = {
  sound: 0.6,
  music: 0.4,
  master: 1,
  notif: 0.8,
  soundInBackground: false,
};
const uniqueSounds = {};

const SOUNDS = {
  BUTTON: buttonSound,
  TRAVEL: travelSound,
  ERROR: errorSound,
};

export const SoundService = (window.SoundService = {
  focused: true,
  currentMusic: [],
  SOUNDS,

  log(...messages) {
    console.log(`<sound>`, ...messages);
  },

  initialize() {
    try {
      const storedSettings = Object.assign(
        {},
        soundSettings,
        JSON.parse(localStorage.getItem("audioVolume"))
      );
      this.adjustMasterVolume(storedSettings.master);
      this.adjustSoundVolume(storedSettings.sound);
      this.adjustMusicVolume(storedSettings.music);
      this.adjustNotifVolume(storedSettings.notif);
      this.enableSoundInBackground(storedSettings.soundInBackground);
    } catch (e) {}

    window.onfocus = function () {
      SoundService.focused = true;
      if (!SoundService.getSoundInBackgroundEnabled()) {
        SoundService.log(`Background mode off: play music.`);
        SoundService.currentMusic.forEach((currentMusic) => {
          if (currentMusic.playing()) {
            currentMusic.fade(0, SoundService.getMusicVolume(), 300);
          }
        });
      }
    };
    window.onblur = function () {
      SoundService.focused = false;
      if (!SoundService.getSoundInBackgroundEnabled()) {
        SoundService.log(`Background mode on: muting music.`);
        SoundService.currentMusic.forEach((currentMusic) => {
          if (currentMusic.playing()) {
            currentMusic.fade(SoundService.getMusicVolume(), 0, 300);
          }
        });
      }
    };
    SoundService.focused = ControlsService.isGameFocused();
    SoundService.log(`Initialized. Focus: ${SoundService.focused}`);
  },

  getVolume() {
    return soundSettings;
  },
  getSoundInBackgroundEnabled() {
    return soundSettings.soundInBackground;
  },

  getNotifVolume() {
    return soundSettings.notif * soundSettings.master;
  },
  getSoundVolume() {
    return soundSettings.sound * soundSettings.master;
  },
  getMusicVolume() {
    return soundSettings.music * soundSettings.master;
  },
  enableSoundInBackground(value) {
    soundSettings.soundInBackground = value;
    localStorage.setItem("audioVolume", JSON.stringify(soundSettings));
  },
  adjustSoundVolume(value) {
    soundSettings.sound = value;
    localStorage.setItem("audioVolume", JSON.stringify(soundSettings));
  },
  adjustMusicVolume(value) {
    soundSettings.music = value;
    localStorage.setItem("audioVolume", JSON.stringify(soundSettings));
    SoundService.currentMusic.forEach((currentMusic) => {
      currentMusic.volume(SoundService.getMusicVolume());
    });
  },
  adjustNotifVolume(value) {
    if (soundSettings.notif === value) {
      return false;
    }
    soundSettings.notif = value;
    localStorage.setItem("audioVolume", JSON.stringify(soundSettings));
    return true;
  },
  adjustMasterVolume(value) {
    soundSettings.master = value;
    localStorage.setItem("audioVolume", JSON.stringify(soundSettings));
    SoundService.currentMusic.forEach((currentMusic) => {
      currentMusic.volume(SoundService.getMusicVolume());
    });
  },

  playNotificationSound(
    group,
    delay = 5 * SECONDS * IN_MILISECONDS,
    soundFile = notificationSound
  ) {
    const volume = SoundService.getNotifVolume();
    if (!volume) {
      return;
    }
    if (
      !!lastNotification[group] &&
      new Date().getTime() - lastNotification[group] < delay
    ) {
      return;
    }
    lastNotification[group] = new Date().getTime();
    SoundService.playSound(soundFile, { volume });
  },

  playSound(
    soundFile,
    {
      preload = false,
      speed = 1,
      unique = null,
      throttle = null,
      volume = this.getSoundVolume(),
    } = {}
  ) {
    if (!soundFile) {
      return;
    }
    if (unique && uniqueSounds[unique]) {
      return;
    }

    const start = new Date().getTime();
    const sound = new Howl({
      src: soundFile,
      rate: speed,
      volume,
      onplay: () => {
        const delay = new Date().getTime() - start;
        if (delay > 500) {
          sound.stop();
        }
      },
      onend: () => {
        if (!throttle) {
          delete uniqueSounds[unique];
        }
      },
    });
    if (!preload) {
      sound.play();
    }

    if (unique) {
      uniqueSounds[unique] = sound;
      if (throttle) {
        setTimeout(() => {
          delete uniqueSounds[unique];
        }, throttle);
      }
    }
    return sound;
  },

  playMusic(musicFile) {
    if (
      this.currentMusic.some((currentMusic) => currentMusic?._src === musicFile)
    ) {
      return;
    }
    const howl = new Howl({
      src: musicFile,
      loop: true,
      volume: this.getMusicVolume(),
    });
    howl.on("play", () => {
      if (SoundService.focused || SoundService.getSoundInBackgroundEnabled()) {
        SoundService.log(`Playing ${musicFile}`);
        howl.fade(0, this.getMusicVolume(), 1000);
      } else {
        SoundService.log(`Playing ${musicFile} (muted)`);
        howl.volume(0);
      }
    });

    this.currentMusic.push(howl);
    howl.play();
  },

  stopMusic(musicFile) {
    const howl = this.currentMusic.find(
      (currentMusic) => currentMusic?._src === musicFile
    );
    if (!howl) {
      return;
    }
    this.currentMusic.remove(howl);
    howl.fade(this.getMusicVolume(), 0, 1000);
    setTimeout(() => {
      howl.stop();
    }, 1000);
  },
});

SoundService.initialize();
