import { Howl, Howler } from "howler";
import "./controls.js";
import buttonSound from "../assets/sounds/button-click.ogg";
import travelSound from "../assets/sounds/travel.ogg";
import errorSound from "../assets/sounds/notification-error.ogg";
import notificationSound from "../assets/sounds/notification.ogg";

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
  currentMusic: null,
  SOUNDS,

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
      if (
        SoundService.currentMusic &&
        SoundService.currentMusic.playing() &&
        !SoundService.getSoundInBackgroundEnabled()
      ) {
        SoundService.currentMusic.fade(0, SoundService.getMusicVolume(), 300);
      }
    };
    window.onblur = function () {
      SoundService.focused = false;
      if (
        SoundService.currentMusic &&
        SoundService.currentMusic.playing() &&
        !SoundService.getSoundInBackgroundEnabled()
      ) {
        SoundService.currentMusic.fade(SoundService.getMusicVolume(), 0, 300);
      }
    };
    SoundService.focused = ControlsService.isGameFocused();
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
    if (this.currentMusic) {
      this.currentMusic.volume(this.getMusicVolume());
    }
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
    if (this.currentMusic) {
      this.currentMusic.volume(this.getMusicVolume());
    }
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
      speed = 1,
      unique = null,
      throttle = null,
      volume = this.getSoundVolume(),
    } = {}
  ) {
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
    sound.play();

    if (unique) {
      uniqueSounds[unique] = sound;
      if (throttle) {
        setTimeout(() => {
          delete uniqueSounds[unique];
        }, throttle);
      }
    }
  },

  playMusic(musicFile) {
    if (this.currentMusic?._src === musicFile) {
      return;
    }
    if (this.currentMusic) {
      const oldMusic = this.currentMusic;
      oldMusic.fade(this.getMusicVolume(), 0, 1000);
      setTimeout(() => {
        oldMusic.stop();
      }, 1000);
    }
    if (!musicFile) {
      this.currentMusic = null;
      return;
    }
    this.currentMusic = new Howl({
      src: musicFile,
      loop: true,
      volume: this.getMusicVolume(),
    });
    SoundService.currentMusic.on("play", () => {
      if (this.currentMusic) {
        if (
          SoundService.focused ||
          SoundService.getSoundInBackgroundEnabled()
        ) {
          this.currentMusic.fade(0, this.getMusicVolume(), 1000);
        } else {
          this.currentMusic.volume(0);
        }
      }
    });
    SoundService.currentMusic.play();
  },
});

SoundService.initialize();
