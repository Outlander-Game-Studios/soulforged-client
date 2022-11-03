<template></template>

<script>
export default {
  subscriptions() {
    return {
      ambientSound: GameService.getLocationStream()
        .map((location) => location.ambientSounds)
        .tap((ambientSounds) => {
          this.setMusicTracks(ambientSounds);
        }),
    };
  },

  mounted() {
    this.currentMusicsByFile = {};
  },

  beforeDestroy() {
    this.setMusicTracks([]);
  },

  methods: {
    setMusicTracks(ambientSounds) {
      const ambientSoundsByTrack = ambientSounds.reduce((acc, ambientSound) => {
        if (
          (acc[ambientSound.track]?.priority || 0) <
          (ambientSound.priority || 500)
        ) {
          acc[ambientSound.track] = ambientSound;
        }
        return acc;
      }, {});
      Object.values(this.currentMusicsByFile).forEach((music) => {
        music.stop = true;
      });
      Object.values(ambientSoundsByTrack).forEach((music) => {
        if (this.currentMusicsByFile[music.file]) {
          this.currentMusicsByFile[music.file].stop = false;
        } else {
          this.currentMusicsByFile[music.file] = music;
          SoundService.playMusic(music.file);
        }
      });

      Object.values(this.currentMusicsByFile).forEach((music) => {
        if (music.stop) {
          delete this.currentMusicsByFile[music.file];
          SoundService.stopMusic(music.file);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
