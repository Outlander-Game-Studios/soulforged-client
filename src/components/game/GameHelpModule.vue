<template>
  <div>
    <div v-if="newVersion" class="new-version" />
    <Help
      title="Game Menu"
      class="help-trigger"
      ref="trigger"
      :icon="menuIcon"
      @open="openGameMenu()"
    >
      <Vertical>
        <Button
          class="menu-button"
          @click="selectOption('interface')"
          v-if="isInGame && !isInCombat"
        >
          Interface overview
        </Button>
        <Button class="menu-button" @click="selectOption('core')"> Core game concepts </Button>
        <Button class="menu-button" @click="selectOption('collections')" v-if="isInGame">
          Collections
        </Button>
        <Button @click="openNewWindow(DISCORD_INVITE_URL)"> Join Discord </Button>
        <Button class="menu-button" @click="selectOption('credits')"> Game Credits </Button>
        <Button
          class="menu-button"
          @click="selectOption('plugins')"
          v-if="allPlugins && allPlugins.length"
        >
          Community Plugins
        </Button>
        <Button class="menu-button" @click="selectOption('statistics')">
          Server Info
          <div v-if="newVersion" class="new-version button" />
        </Button>
        <Button class="menu-button" @click="selectOption('settings')"> Settings </Button>
        <Button class="menu-button" @click="selectOption('logout')"> Log out </Button>
      </Vertical>
    </Help>
    <CollectionsDisplay
      ref="collectionsComponent"
      v-if="showCollections"
      @close="closeCollections()"
    />
    <Modal v-if="showCoreConcepts" @close="showCoreConcepts = false">
      <template v-slot:title> Core concepts </template>
      <template v-slot:contents>
        <Header alt2>Game Rules</Header>
        <HelpGameRules />
        <Header alt2>Time & Action Points</Header>
        <HelpActionPoints />
        <Header alt2>Naming</Header>
        <HelpNaming />
        <Header alt2>Cooperation & Essence</Header>
        <HelpEssence />
        <Header alt2>Death</Header>
        <HelpDeath />
      </template>
    </Modal>
    <CreditsModal v-if="showCredits" @close="showCredits = false" />
    <div class="interface-overview" v-if="showInterfaceOverview">
      <div class="backdrop" @click="closeInterfaceOverview()" />
      <ExplanationIndicator
        v-for="tabHelper in tabHelpers"
        :key="tabHelper.label"
        :selector="'.tab-icon.' + tabHelper.selector"
        landscapePlacement="left"
        portraitPlacement="top"
      >
        <Help :title="tabHelper.label">
          <component :is="'HelpPanel' + tabHelper.label" />
        </Help>
        {{ tabHelper.label }}
      </ExplanationIndicator>
      <ExplanationIndicator selector=".controls-sticky .ap-container" placement="right">
        <Help title="Action Points"><HelpActionPoints /></Help>
        Action Points
      </ExplanationIndicator>
      <ExplanationIndicator
        selector=".visible-map .current-location"
        landscapePlacement="right"
        portraitPlacement="top"
      >
        <Help title="Your location"><HelpYourLocation /></Help>
        Your location
      </ExplanationIndicator>
      <ExplanationIndicator selector=".controls-sticky .effects-container" placement="right">
        <Help title="Your effects"><HelpEffects /></Help>
        Your effects
      </ExplanationIndicator>
      <ExplanationIndicator selector=".controls-sticky .currency-value" placement="right">
        <Help title="Essence"><HelpEssence /></Help>
        Essence
      </ExplanationIndicator>
      <ExplanationIndicator
        v-if="mainEntity && !mainEntity.operation"
        selector=".travel-arrow"
        landscapePlacement="right"
        portraitPlacement="top"
      >
        <Help title="Travel">
          <HelpTravel />
        </Help>
        Travel
      </ExplanationIndicator>
      <Button @click="closeInterfaceOverview()" class="close-interface-guide"> Close </Button>
    </div>
    <Modal v-if="showPlugins" @close="showPlugins = false">
      <template v-slot:title>
        Community Plugins

        <Help title="Community Plugins"><HelpPlugins /></Help>
      </template>
      <template v-slot:contents>
        <PluginSettings />
      </template>
    </Modal>
    <Modal v-if="showSettings" dialog @close="showSettings = false">
      <template v-slot:title> Settings </template>
      <template v-slot:contents>
        <UserSettings />
      </template>
    </Modal>
    <ExplanationIndicator
      v-if="showHelpIndicator"
      selector=".help-trigger"
      landscapePlacement="top-left"
      portraitPlacement="left"
      class="help-indicator"
    >
      <div class="help-indicator-text">Click here for additional help</div>
    </ExplanationIndicator>
    <Modal v-if="option === 'logout'" dialog @close="option = null">
      <template v-slot:title> Log out </template>
      <template v-slot:contents>
        <Vertical>
          <div class="important-text">Are you sure you want to log out?</div>
          <div class="big-warning">
            It is against the rules to use<br />
            multiple accounts to access the game.
          </div>
          <HorizontalCenter>
            <Button @click="logout()" :processing="loggingOut">Log out</Button>
            <Button @click="option = null">Stay logged in</Button>
          </HorizontalCenter>
          <Description>
            If you'd like to completely delete your account and remove the information click
            <a href="#" @click="startDeletion()">here</a>
          </Description>
        </Vertical>
      </template>
    </Modal>
    <Modal v-if="option === 'deleteMyAccount'" dialog @close="option = null">
      <template v-slot:title> Delete account </template>
      <template v-slot:contents>
        <Vertical>
          <div>
            <div class="important-text">
              Are you sure absolutely sure you want to delete your account?
            </div>
            <div class="error-text">
              Note: This action cannot be reversed and will result in loss of<br />
              progress and any resources you accumulated in the game!
            </div>
          </div>
          <HorizontalCenter>
            <Checkbox v-model="confirmDelete"> I confirm I want to delete my account </Checkbox>
          </HorizontalCenter>
          <HorizontalCenter>
            <Button @click="deleteMyAccount()" :processing="loggingOut" :disabled="!confirmDelete">
              Delete my account
            </Button>
          </HorizontalCenter>
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
import menuIcon from '../../assets/ui/cartoon/icons/menu.png'

export default {
  data: () => ({
    menuIcon,
    showCollections: false,
    showCoreConcepts: false,
    showCredits: false,
    showInterfaceOverview: false,
    showSettings: false,
    showPlugins: false,
    showHelpIndicator: false,
    option: false,
    loggingOut: false,
    confirmDelete: false,
    tabHelpers: [
      {
        selector: 'location',
        label: 'Location',
      },
      {
        selector: 'inventory',
        label: 'Inventory',
      },
      {
        selector: 'character',
        label: 'Character',
      },
      {
        selector: 'craft',
        label: 'Crafting',
      },
      {
        selector: 'research',
        label: 'Research',
      },
      {
        selector: 'trade',
        label: 'Trade',
      },
      {
        selector: 'chat',
        label: 'Chat',
      },
    ],
    DISCORD_INVITE_URL,
  }),

  subscriptions() {
    return {
      allPlugins: PluginService.getAllPluginsStream(),
      mainEntity: GameService.getRootEntityStream().tap((mainEntity) => {
        if (!mainEntity.operation && LocalStorageService.getItem('HideHelpIndicator', 0) < 2) {
          this.showHelpIndicator = true
        }
      }),
      isInGame: GameService.getRootEntityStream(),
      isInCombat: GameService.getRootEntityStream()
        .map((c) => c?.operation?.type === 'CombatOperation')
        .distinctUntilChanged(undefined, JSON.stringify),
      newVersion: Rx.combineLatest(
        GameService.getVersionStream(),
        GameService.getLastViewedVersionStream(),
      ).map(
        ([version, lastVersion]) =>
          version.split('.').slice(0, 2).join('.') !== lastVersion.split('.').slice(0, 2).join('.'),
      ),
      openMilestones: ControlsService.getControlEventStream('openMilestones').tap(([data]) => {
        this.showCollections = true
        setTimeout(() => {
          this.$refs.collectionsComponent.showCategory(data.categoryIdx)
        })
      }),
    }
  },

  computed: {
    newPageTarget() {
      return ControlsService.cordovaLoginAvailable() ? '_system' : '_blank'
    },
  },

  methods: {
    startDeletion() {
      this.option = 'deleteMyAccount'
      this.confirmDelete = false
    },

    deleteMyAccount() {
      this.loggingOut = true
      GameService.request(REQUEST_CODES.DELETE_MY_ACCOUNT).then(() => {
        window.location.reload()
      })
    },

    logout() {
      this.loggingOut = true
      GameService.request(REQUEST_CODES.LOGOUT).then(() => {
        window.location.reload()
      })
    },

    openGameMenu() {
      this.showHelpIndicator = false
      LocalStorageService.setItem('HideHelpIndicator', 2)
    },

    selectOption(option) {
      switch (option) {
        case 'statistics':
          window.location = '#/stats'
          return
        case 'collections':
          this.$refs.trigger.close()
          this.showCollections = true
          return
        case 'core':
          this.showCoreConcepts = true
          return
        case 'credits':
          this.showCredits = true
          return
        case 'interface':
          this.$refs.trigger.close()
          this.showInterfaceOverview = true
          return
        case 'settings':
          this.showSettings = true
          return
        case 'plugins':
          this.showPlugins = true
          return
        default:
          this.option = option
          return
      }
    },

    closeInterfaceOverview() {
      this.showInterfaceOverview = false
      this.$refs.trigger.open()
    },

    closeCollections() {
      this.showCollections = false
      this.$refs.trigger.open()
    },

    openNewWindow(url) {
      ControlsService.openNewWindow(url)
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

@keyframes help-indicator {
  0% {
    color: white;
  }
  50% {
    color: deepskyblue;
  }
  100% {
    color: white;
  }
}

.help-indicator {
  left: initial !important;
  margin-bottom: -1rem;
  display: inline-block;
  animation: help-indicator 1s linear infinite;

  @media (orientation: landscape) {
    position: absolute !important;
  }
}

.help-trigger {
  font-size: 250%;
  //@include utils.filter(drop-shadow(0.3rem 0.3rem 0.3rem black));
  display: flex;
}
.backdrop {
  @include utils.fill();
  position: fixed;
  background-color: rgba(0, 0, 0, 0.55);
  z-index: 450;
}
.close-interface-guide {
  z-index: 475;
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
}
.button-link {
  @include utils.text-outline();
  text-decoration: none;
  position: relative;
}
.menu-button {
  white-space: nowrap;
}

.new-version {
  width: 3rem;
  height: 6rem;
  pointer-events: none;
  background-image: url(ui-asset('/icons/exclamation.png'));
  background-size: auto 100%;
  background-position: center center;
  transform: rotate(10deg);
  position: absolute;
  right: -0.5rem;
  bottom: -0.5rem;
  z-index: 2;

  &.button {
    width: 4rem;
    height: 7rem;
    top: -2rem;
    right: -1rem;
  }
}
</style>
