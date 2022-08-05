<template>
  <div class="login-wrapper">
    <AutoSizer />
    <CreditsModal v-if="showCredits" @close="showCredits = false" />
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
            <HorizontalCenter v-if="error">
              <span class="error"> {{ error }} </span>
            </HorizontalCenter>
            <HorizontalCenter>
              <Checkbox v-model="acceptedTOE">
                <span class="toe-accept">
                  I agree to the
                  <a
                    target="_blank"
                    href="https://soulforged.net/#/legal/termsAndConditions"
                    >Terms and Conditions</a
                  >,<br />
                  <a
                    target="_blank"
                    href="https://soulforged.net/#/legal/privacyPolicy"
                    >Privacy Policy</a
                  >
                  and
                  <a
                    target="_blank"
                    href="https://soulforged.net/#/legal/cookiePolicy"
                    >Cookie Policy</a
                  >.
                </span>
              </Checkbox>
            </HorizontalCenter>
            <HorizontalCenter>
              <Button
                :disabled="!acceptedTOE"
                @click="startLogin()"
                class="login-button"
                :processing="loggingIn"
                >Login</Button
              >
            </HorizontalCenter>
          </Spaced>
        </Container>
      </HorizontalCenter>
      <div class="spacer"></div>
      <div class="buttons-container">
        <Vertical>
          <Button
            v-if="cordovaLoginEnabled || electronLoginEnabled"
            :disabled="!acceptedTOE"
            @click="goToLogin()"
            :processing="loggingIn"
            >Manual Login</Button
          >
          <Button @click="showRules = true"> Game Rules </Button>
          <Button @click="$refs.discordButton.click()">
            <a
              ref="discordButton"
              class="button-link"
              href="https://discord.gg/XExbewT5GQ"
              target="_blank"
              @click.stop
            >
              Join Discord
            </a>
          </Button>
          <Button @click="showCredits = true"> Game Credits </Button>
        </Vertical>
        <Modal v-if="showRules" dialog large @close="showRules = false">
          <template v-slot:title> Game rules </template>
          <template v-slot:contents>
            <p>
              The following activities are considered against the rules and may
              result in termination of your access to the game:
            </p>
            <Description>
              <ul>
                <li>
                  Accessing the game in an unauthorized manner (including using
                  automated third party software)
                </li>
                <li>Playing using multiple accounts</li>
                <li>Sharing accounts</li>
                <li>Selling or trading accounts</li>
                <li>
                  Gathering in-game currency, items, or resources for sale
                  outside of the game
                </li>
                <li>
                  Using language that is deemed obscene, invasive, threatening,
                  harassing, abusive, hateful, racist or otherwise objectionable
                  or inappropriate
                </li>
              </ul>
            </Description>
          </template>
        </Modal>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",

  data: () => ({
    acceptedTOE: false,
    showRules: false,
    showCredits: false,
    loggingIn: false,
    cordovaLoginEnabled: ControlsService.cordovaLoginAvailable(),
    electronLoginEnabled: ControlsService.electronLoginAvailable(),
  }),

  computed: {
    error() {
      return this.$route?.query?.error;
    },
  },

  methods: {
    startLogin() {
      this.loggingIn = true;
      setTimeout(() => {
        this.loggingIn = false;
      }, 3000);
      if (ControlsService.electronLoginAvailable()) {
        ControlsService.initiateElectronLogin();
      } else if (ControlsService.cordovaLoginAvailable()) {
        ControlsService.initiateCordovaLogin();
      } else {
        this.goToLogin();
      }
    },

    goToLogin() {
      window.location = "/api/login";
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

.intro {
  color: #351908;
  text-align: center;
  font-size: 90%;

  ul {
    margin: 0.5rem;
  }

  li {
    text-align: left;
    font-size: 90%;
  }

  a {
    color: saddlebrown;
    font-size: 100%;
  }
}

.toe-accept {
  &,
  a {
    display: inline-block;
    font-size: 1.8rem;
    line-height: 2rem;
    margin-top: 0;
  }
}

.game-title-container {
  font-size: 250%;
  margin-bottom: 1.5rem;
}

.login-button {
  margin-top: 2rem;
}
.button-link {
  @include text-outline();
  text-decoration: none;
  position: relative;
}

.buttons-container {
  display: flex;
  justify-content: flex-end;
}

.error {
  padding: 0.5rem;
  font-weight: bold;
  font-size: 150%;
  @include text-bad();
}

.spacer {
  flex-grow: 1;
}
</style>
