<template>
  <div class="login-wrapper">
    <AutoSizer />
    <div class="spacer"></div>
    <div class="main-layout">
      <div>
        <HorizontalCenter class="game-title-container">
          <GameTitle />
        </HorizontalCenter>
      </div>
      <HorizontalCenter>
        <Container borderType="alt" :borderSize="1.5">
          <Spaced>
            <div class="main-text" v-if="!error">
              Continue the log in process in the newly opened browser window.
            </div>
            <div v-else class="login-error-text">
              {{ error }}
            </div>
            <br />
            <HorizontalCenter>
              <Button @click="cancel()">{{ error ? "Back" : "Cancel" }}</Button>
            </HorizontalCenter>
          </Spaced>
        </Container>
      </HorizontalCenter>
    </div>
    <div class="spacer"></div>
    <div class="spacer"></div>
  </div>
</template>

<script>
export default {
  name: "LoginElectron",

  data: () => ({
    error: null,
  }),

  mounted() {
    this.initCheck();
  },

  methods: {
    initCheck() {
      const token = this.$router.currentRoute?.query?.token;
      if (!token) {
        return this.handleError("Invalid token");
      }
      window.location = `/api/login/electron/wait?token=${token}`;
    },

    handleError(error) {
      this.error = error;
    },

    cancel() {
      window.location = "#/login";
    },
  },
};
</script>

<style scoped lang="scss">
@import "../utils.scss";

.login-wrapper {
  padding: 3rem;
  box-sizing: border-box;
  height: 100%;
  max-height: 100%;
  overflow: auto;
  background-image: url(ui-asset("/backdrops/main.jpg", "src/"));
  background-size: cover;
  background-position: center center;
  display: flex;
  flex-direction: column;
}

.main-layout {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.game-title-container {
  font-size: 250%;
  margin-bottom: 1.5rem;
}

.main-text {
  padding: 0.5rem 1.5rem;
  font-size: 125%;
  text-align: center;
}

.login-error-text {
  padding: 0.5rem 1.5rem;
  font-size: 125%;
  @include text-bad();
}

.spacer {
  flex-grow: 1;
}
</style>
