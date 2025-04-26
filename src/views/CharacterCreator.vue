<template>
  <div class="character-creator">
    <AutoSizer />
    <div class="main-container">
      <Header class="creator-header"> Create character </Header>
      <HorizontalCenter>
        <Container borderType="alt" :borderSize="1.5">
          <Spaced>
            <Horizontal>
              <Avatar :avatarAssets="avatarAssets" size="large" />
              <Vertical>
                <HorizontalFill>
                  <label>Name</label>
                  <Input v-model:value="characterName" @enter="$refs.submit.click()" autoFocus />
                </HorizontalFill>
                <div class="error-text">{{ error }}</div>
                <OptionSelector
                  v-if="races && races.length > 1"
                  :label="'Race: ' + race"
                  v-model:value="race"
                  :options="races"
                  random
                  cycle
                />
                <OptionSelector
                  v-for="(def, feature) in featureSelections"
                  :key="def.label"
                  :label="def.label + ': ' + (+looks[feature] + 1)"
                  v-model:value="looks[feature]"
                  :options="def.options"
                  @update:value="updateAvatar()"
                  random
                  cycle
                />
                <Button @click="clickCreate()" :processing="processing" class="submit" ref="submit">
                  Create
                </Button>
              </Vertical>
            </Horizontal>
          </Spaced>
        </Container>
      </HorizontalCenter>
      <Modal dialog v-if="showIntro" @close="showIntro = false">
        <template v-slot:title> Welcome to Soulforged! </template>
        <template v-slot:contents>
          <Vertical>
            <div class="intro-text">
              Please note that this game rewards planning, exploration, understanding and
              cooperation.<br />
              It doesn't really hold your hand and can be quite unforgiving at times.<br />
              <br />
              With that said, thank you for joining and I hope you'll have a fun experience!
            </div>
            <HorizontalCenter>
              <Button @click="showIntro = false">Continue</Button>
            </HorizontalCenter>
          </Vertical>
        </template>
      </Modal>
    </div>
    <div class="menu-button-wrapper">
      <GameHelpModule />
    </div>
  </div>
</template>

<script>
export default rxComponent({
  data: () => ({
    race: 'Human',
    looks: {},
    characterName: '',
    error: '',
    processing: false,
    showIntro: false,
  }),

  subscriptions() {
    const racesDefinitionStream = Rx.fromPromise(GameService.request(REQUEST_CODES.RACES))
    return {
      characterCount: Rx.fromPromise(GameService.request(REQUEST_CODES.CHARACTER_COUNT)).tap(
        (count) => {
          if (count === 0) {
            this.showIntro = true
          }
        },
      ),
      racesDefinition: racesDefinitionStream,
      featureSelections: Rx.combineLatest([racesDefinitionStream, this.$stream('race')]).map(
        ([definitions, race]) => {
          return definitions?.[race]
        },
      ),
      races: racesDefinitionStream.map((definitions) => Object.keys(definitions)),
      avatarAssets: Rx.combineLatest([this.$stream('race'), this.$stream('looks')])
        .filter(([race, looks]) => race && Object.keys(looks || {}).length)
        .switchMap(([race, looks]) =>
          GameService.request(REQUEST_CODES.AVATAR_DATA, {
            race,
            looks,
          }),
        ),
    }
  },

  created() {
    this.checkCreatureCreated()
  },

  methods: {
    checkCreatureCreated() {
      GameService.getRootEntityStream(true)
        .filter((entity) => !!entity)
        .first()
        .subscribe((entity) => {
          this.redirectToGame()
        })
    },

    updateAvatar() {
      this.looks = { ...this.looks }
    },

    redirectToGame() {
      window.location.hash = '/main'
    },

    clickCreate() {
      this.processing = true
      GameService.request(REQUEST_CODES.CREATE_CHARACTER, {
        characterName: this.characterName,
        race: this.race,
        looks: this.looks,
      })
        .then((response) => {
          if (!response.ok) {
            this.error = response.message
            this.processing = false
          } else {
            this.checkCreatureCreated()
          }
        })
        .catch(() => {
          this.processing = false
        })
    },
  },
})
</script>

<style scoped lang="scss">
@use '../utils.scss';

.character-creator {
  padding: 5vw;
  box-sizing: border-box;
  height: 100%;
  max-height: 100%;
  overflow: auto;
  background-image: utils.ui-asset('/backdrops/main.jpg', 'src/');
  background-size: cover;
  background-position: center center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.main-container {
  position: relative;
  width: 54rem;
  max-width: 90vw;
  margin: 0 auto;
}
.creator-header {
  position: absolute !important;
  top: -2.5rem;
  left: 50%;
  margin-left: -11rem !important;
  width: 22rem;
}
label {
  line-height: 5rem;
}
.intro-text {
  font-style: italic;
  padding: 1rem;
}
.menu-button-wrapper {
  position: absolute;
  bottom: 0.3rem;
  right: 0.3rem;
  z-index: 6;
}
</style>
