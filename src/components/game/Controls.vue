<template>
  <div class="main-controls" v-if="mainEntity">
    <div class="controls-content">
      <Tabs
        :placement="controlTabsPlacement"
        :allowEmpty="true"
        :fullHeight="false"
        ref="tabs"
        @change="tabChanged"
      >
        <template v-slot:header:Location>
          <div class="tab-icon location" :style="{ backgroundImage: `url(${locationIcon})` }" />
        </template>
        <template v-slot:header:Items>
          <div class="tab-icon inventory" :style="{ backgroundImage: `url(${itemsIcon})` }" />
        </template>
        <template v-slot:header:Craft>
          <div class="tab-icon craft" :style="{ backgroundImage: `url(${craftIcon})` }" />
        </template>
        <template v-slot:header:Research>
          <div class="tab-icon research" :style="{ backgroundImage: `url(${researchIcon})` }" />
        </template>
        <template v-slot:header:Character>
          <div class="tab-icon character" :style="{ backgroundImage: `url(${characterIcon})` }" />
        </template>
        <template v-slot:header:Chat>
          <div class="tab-icon chat" :style="{ backgroundImage: `url(${chatIcon})` }" />
        </template>
        <template v-slot:header:Trade>
          <div class="tab-icon trade" :style="{ backgroundImage: `url(${tradeIcon})` }" />
        </template>
        <Tab header="Location" ref="locationTab">
          <div class="controls-tab-contents small">
            <LocationPanel />
          </div>
        </Tab>
        <Tab header="Items" ref="inventoryTab">
          <div class="controls-tab-contents small">
            <InventoryPanel />
          </div>
        </Tab>
        <Tab header="Character" ref="characterTab">
          <div class="controls-tab-contents small">
            <CharacterPanel />
          </div>
        </Tab>
        <Tab header="Craft">
          <div class="controls-tab-contents small">
            <CraftsPanel />
            <PlansPanel />
          </div>
        </Tab>
        <Tab header="Research" :indicator="newResearchesCount" indicatorStyle="important">
          <div class="controls-tab-contents small">
            <ResearchesPanel />
          </div>
        </Tab>
        <Tab header="Chat" :indicator="newChatCount" indicatorStyle="important">
          <div class="controls-tab-contents small">
            <ChatPanel />
          </div>
        </Tab>
        <Tab
          header="Trade"
          :indicator="tradeCount"
          :indicatorStyle="anyPendingTrades ? 'important' : 'alt2'"
          ref="tradeTab"
        >
          <div class="controls-tab-contents small">
            <TradePanel />
          </div>
        </Tab>
      </Tabs>
    </div>
  </div>
</template>

<script>
import locationIcon from '../../assets/ui/cartoon/icons/tabs/location.png'
import characterIcon from '../../assets/ui/cartoon/icons/tabs/character.png'
import itemsIcon from '../../assets/ui/cartoon/icons/tabs/items.png'
import craftIcon from '../../assets/ui/cartoon/icons/tabs/craft.png'
import researchIcon from '../../assets/ui/cartoon/icons/tabs/research.png'
import chatIcon from '../../assets/ui/cartoon/icons/tabs/chat.png'
import tradeIcon from '../../assets/ui/cartoon/icons/tabs/trade.png'
import pageSound from '../../assets/sounds/page.mp3'
import pageCloseSound from '../../assets/sounds/page-close.mp3'

export default rxComponent({
  data: () => ({
    controlTabsPlacement: null,
    locationIcon,
    characterIcon,
    itemsIcon,
    craftIcon,
    researchIcon,
    chatIcon,
    tradeIcon,
    initiated: false,
  }),

  subscriptions() {
    const mainEntity = GameService.getRootEntityStream()
    return {
      mainEntity,
      newResearchesCount: GameService.getResearchesStream()
        .map((researches) => researches.filter((r) => !r.seen).length)
        .tap((count) => {
          if (this.newResearchesCount !== undefined && count > this.newResearchesCount) {
            SoundService.playNotificationSound('research')
          }
        }),
      newChatCount: ChatService.getUnreadMessagesCountStream()
        .map((count) => (count > 99 ? '99+' : count))
        .tap((count) => {
          if (this.newChatCount !== undefined && count > this.newChatCount) {
            SoundService.playNotificationSound('chat')
          }
        }),
      tradeCount: mainEntity
        .map((entity) => entity?.trades?.length)
        .tap((count) => {
          if (this.tradeCount !== undefined && count > this.tradeCount) {
            SoundService.playNotificationSound('trade')
          }
        }),
      anyPendingTrades: mainEntity
        .map((entity) => entity?.trades)
        .filter((tradeIds) => !!tradeIds)
        .switchMap((tradeIds) => GameService.getEntitiesStream(tradeIds))
        .map((trades) =>
          trades.some(
            (trade) =>
              !trade.cancelled && !trade.completed && trade.canAccept && !trade.me.accepted,
          ),
        ),
      closePanel: ControlsService.getControlEventStream('closePanel').tap(() => {
        this.$refs.tabs.closeTab()
      }),
      openInventoryPanel: ControlsService.getControlEventStream('openPanel-inventory').tap(() => {
        this.$refs.tabs.setActiveByComponent(this.$refs.inventoryTab)
      }),
      openCharacterPanel: ControlsService.getControlEventStream('openPanel-character-effects').tap(
        () => {
          this.$refs.tabs.setActiveByComponent(this.$refs.characterTab)
        },
      ),
      openTradePanel: ControlsService.getControlEventStream('openPanel-trade').tap(() => {
        this.$refs.tabs.setActiveByComponent(this.$refs.tradeTab)
      }),
      openLocationPanel: ControlsService.getControlEventStream('openPanel-location').tap(() => {
        this.$refs.tabs.setActiveByComponent(this.$refs.locationTab)
      }),
    }
  },

  mounted() {
    this.calculateControlTabsPlacement()
    window.addEventListener('resize', () => {
      this.calculateControlTabsPlacement()
    })
  },

  methods: {
    tabChanged(tab) {
      ControlsService.setCurrentOpenTab(tab)
      if (this.initiated) {
        if (tab) {
          SoundService.playSound(pageSound)
        } else {
          SoundService.playSound(pageCloseSound)
        }
      } else {
        this.initiated = true
      }
    },

    calculateControlTabsPlacement() {
      const targetPlacement =
        window.innerWidth / window.innerHeight > 1 ? Tabs.POSITION.RIGHT : Tabs.POSITION.BOTTOM
      if (this.controlTabsPlacement !== targetPlacement) {
        this.controlTabsPlacement = targetPlacement
      }
    },
  },
})
</script>

<style scoped lang="scss">
.main-controls {
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (orientation: landscape) {
    width: 40rem;

    .controls-content {
      flex-direction: column;
    }
  }

  @media (orientation: portrait) {
    width: calc(1 * var(--app-width));
    height: 40rem;
  }

  .controls-content {
    flex-grow: 1;
    display: flex;

    @media (orientation: portrait) {
      justify-content: flex-end;
      overflow: auto;
    }
  }

  .controls-content,
  .tabs {
    max-height: var(--app-height);
  }
}

.tab-icon {
  background-size: 100% 100%;
  margin: -1.5rem;
  width: 6rem;
  height: 6rem;
}
</style>
