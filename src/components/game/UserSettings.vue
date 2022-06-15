<template>
  <Vertical>
    <Header alt2>Master volume</Header>
    <Input
      type="number"
      :min="0"
      :max="100"
      :value="audioVolume.master"
      noInputElement
      @input="setMasterVolume($event)"
    />
    <Header alt2>Sound volume</Header>
    <Input
      type="number"
      :min="0"
      :max="100"
      :value="audioVolume.sound"
      noInputElement
      @input="setSoundVolume($event)"
    />
    <Header alt2>Ambience volume</Header>
    <Input
      type="number"
      :min="0"
      :max="100"
      :value="audioVolume.music"
      noInputElement
      @input="setMusicVolume($event)"
    />
    <Header alt2>Notification volume</Header>
    <Input
      type="number"
      :min="0"
      :max="100"
      :value="audioVolume.notif"
      noInputElement
      @input="setNotifVolume($event)"
    />
    <Header alt2>Other settings</Header>
    <Checkbox
      v-model="enableSoundsInBackground"
      @input="setEnableSoundInBackground($event)"
    >
      Play ambience in background
    </Checkbox>
    <div class="debug-info">
      <LabeledValue label="Rev ID">{{ startupId }}</LabeledValue>
      <LabeledValue label="Touch enabled">{{ touch }}</LabeledValue>
      <LabeledValue label="Resolution">{{ resolution }}</LabeledValue>
      <LabeledValue label="UI Scaling">{{ scaling }}</LabeledValue>
      <LabeledValue label="Pixel ratio">{{ pixelRatio }}</LabeledValue>
    </div>
  </Vertical>
</template>

<script>
export default {
  data: () => ({
    audioVolume: {},
    enableSoundsInBackground: null,
    startupId: GameService.getClientStartupId(),
    touch: ControlsService.isTouchDevice() ? "Yes" : "No",
    resolution: `${getScreenWidth()} x ${getScreenHeight()}`,
    scaling: window.fontSizeOverride.toFixed(2),
    pixelRatio: window.devicePixelRatio,
  }),

  created() {
    const currentVolume = SoundService.getVolume();
    this.enableSoundsInBackground = SoundService.getSoundInBackgroundEnabled();
    this.audioVolume = {
      sound: currentVolume.sound * 100,
      music: currentVolume.music * 100,
      master: currentVolume.master * 100,
      notif: currentVolume.notif * 100,
    };
  },

  methods: {
    setEnableSoundInBackground(value) {
      SoundService.enableSoundInBackground(value);
    },
    setMasterVolume(value) {
      SoundService.adjustMasterVolume(value / 100);
    },
    setSoundVolume(value) {
      SoundService.adjustSoundVolume(value / 100);
    },
    setMusicVolume(value) {
      SoundService.adjustMusicVolume(value / 100);
    },
    setNotifVolume(value) {
      if (SoundService.adjustNotifVolume(value / 100)) {
        clearTimeout(this.notifTimeout);
        this.notifTimeout = setTimeout(() => {
          SoundService.playNotificationSound("setting", 1);
        }, 300);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.debug-info {
  font-size: 65%;
}
</style>
