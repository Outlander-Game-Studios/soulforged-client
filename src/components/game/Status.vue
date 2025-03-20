<template>
  <div class="controls-sticky" v-if="mainEntity">
    <div class="avatar interactive" @click="clickAvatar()">
      <Avatar :creature="myCreature" :headOnly="true" size="large" />
    </div>
    <CreatureDetailsModal
      v-if="showDetails"
      :creatureId="myCreature.id"
      @close="showDetails = false"
      @action="showDetails = false"
    />
    <div class="info-container-wrapper">
      <div class="info-container">
        <HorizontalFill tight class="ap-container">
          <APBarCurrent />
        </HorizontalFill>
        <Container borderSize="0.5" class="effects-container interactive" @click="openEffects()">
          <Effects row :effects="mainEntity.effects" :size="3" />
        </Container>
        <div class="currency-container">
          <EssenceIndicator class="essence-indicator" />
        </div>
      </div>
    </div>
    <div class="quick-actions-wrapper">
      <QuickActions />
    </div>

    <Modal v-if="mainEntity.nameChanged" dialog>
      <Vertical>
        <Description>
          Your name has been found to be in violation <br />
          of the naming policy and has been changed.
        </Description>
        <HorizontalCenter>
          <Button @click="confirmNameChanged()">Accept</Button>
        </HorizontalCenter>
      </Vertical>
    </Modal>
    <Modal v-if="mainEntity.customMessage" dialog>
      <Vertical>
        <RichText :value="mainEntity.customMessage" />
        <HorizontalCenter>
          <Button @click="confirmCustomMessage()">Confirm</Button>
        </HorizontalCenter>
      </Vertical>
    </Modal>
  </div>
</template>

<script>
import pageSound from '../../assets/sounds/page.mp3'

export default {
  data: () => ({
    showDetails: false,
  }),

  subscriptions() {
    let mainEntity = GameService.getRootEntityStream()
    return {
      mainEntity,
      myCreature: GameService.getMyCreatureStream(),
    }
  },

  methods: {
    clickAvatar() {
      this.showDetails = true
      SoundService.playSound(pageSound)
    },

    confirmNameChanged() {
      GameService.request(REQUEST_CODES.CONFIRM_NAME_CHANGE)
    },

    confirmCustomMessage() {
      GameService.request(REQUEST_CODES.CONFIRM_CUSTOM_MESSAGE)
    },

    openEffects() {
      ControlsService.triggerControlEvent('openPanel-character-effects')
      setTimeout(() => {
        document.getElementById('effects-section')?.scrollIntoView({
          block: 'start',
        })
      })
    },

    triggerQuickAction(quickAction) {
      const item = quickAction.item
      const action = item.actions.find(({ actionId }) => actionId === quickAction.actionId)
      GameService.performAction(item, action, quickAction.parameters)
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.controls-sticky {
  max-width: 0;
  width: 0;
  display: flex;
  padding: 1rem;

  .avatar {
    z-index: 2;
  }

  .info-container {
    display: flex;
    flex-direction: column;
    margin: 0.5rem 0 0 -0.5rem;
    pointer-events: none;
  }

  .info-container-wrapper {
    pointer-events: none;
  }

  .ap-container,
  .effects-container {
    pointer-events: all;
    width: 21rem;
  }
  .currency-container {
    display: flex;
  }

  .effects-container {
    overflow: hidden;
  }

  .essence-indicator {
    pointer-events: all;
  }
}

.quick-actions-wrapper {
  position: absolute;
  top: 100%;
}
</style>
