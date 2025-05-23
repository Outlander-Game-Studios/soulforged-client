<template>
  <div>
    <div class="quick-actions">
      <div class="flex">
        <Container :borderSize="0.35">
          <LoadingPlaceholder v-if="!quickActions" :size="3" />
          <div v-else class="settings-button interactive" @click="openSettings()">
            <div class="settings-icon"></div>
          </div>
        </Container>
        <div class="collapse-button-wrapper" @click="toggleCollapse()">
          <BorderRound
            v-if="showCollapseControls"
            class="collapse-button-border"
            borderType="tightGlow"
            backgroundType="base"
            :size="3"
          >
            <div class="collapse-button" :class="{ collapsed: collapsed }" />
          </BorderRound>
        </div>
      </div>
      <div
        ref="quickActionContainer"
        class="quick-action-container"
        :class="{ collapsed: collapsed }"
      >
        <div v-for="(validQuickAction, idx) in validQuickActions" :key="idx">
          <StructureIcon
            v-if="validQuickAction.item.operational"
            :structure="validQuickAction.item"
            :size="5"
            class="interactive"
            @click="triggerQuickAction(validQuickAction)"
          >
            <template v-slot:textTopRight>
              <span class="quick-action-label">
                <RichText :value="validQuickAction.label" nonInteractive />
              </span>
            </template>
          </StructureIcon>
          <Item
            v-else
            :data="validQuickAction.item"
            :size="5"
            class="interactive"
            @click="triggerQuickAction(validQuickAction)"
            @longClick="triggerQuickAction(validQuickAction, true)"
          >
            <template v-slot:textTopRight>
              <span class="quick-action-label">
                <RichText :value="validQuickAction.label" nonInteractive />
              </span>
            </template>
          </Item>
        </div>
      </div>
    </div>
    <Modal v-if="settings" dialog large @close="settings = false">
      <template v-slot:title>
        <Horizontal>
          <div class="settings-icon"></div>
          <div>Quick Actions</div>
          <div class="settings-icon"></div>
        </Horizontal>
      </template>
      <template v-slot:contents>
        <Vertical>
          <ListItem v-for="(quickAction, idx) in quickActions" :key="idx">
            <template v-slot:icon>
              <Icon v-if="!quickAction.item" :src="unknownImg" :size="6" />
              <Item v-else-if="isItem(quickAction.item)" :size="6" :data="quickAction.item" />
              <StructureIcon v-else :size="6" :structure="quickAction.item" />
            </template>
            <template v-slot:title>
              <RichText :value="quickAction.label" />
            </template>
            <template v-slot:subtitle>
              <RichText v-if="quickAction.item" :value="quickAction.item.name" />
              <span v-else>Missing</span>
              <span v-if="!!quickAction.itemId"> (specific one)</span>
            </template>
            <template v-slot:buttons>
              <Horizontal>
                <Button @click="removeQuickAction(idx)">Remove</Button>
                <Button
                  class="order-arrow"
                  :class="{ no: idx === quickActions.length - 1 }"
                  @click="moveDown(idx)"
                  >▼</Button
                >
                <Button class="order-arrow" :class="{ no: idx === 0 }" @click="moveUp(idx)"
                  >▲</Button
                >
              </Horizontal>
            </template>
          </ListItem>
          <Description>
            Quick actions: {{ quickActions.length }} /
            {{ QUICK_ACTIONS_LIMIT }}
          </Description>
          <HorizontalCenter>
            <Button @click="startAdding()" :disabled="quickActions.length >= QUICK_ACTIONS_LIMIT">
              Add quick action
            </Button>
          </HorizontalCenter>
          <Description>
            <em>Tip:</em> Pressing and holding your cursor over a Quick Action<br />
            will apply to maximum possible amount of the item.
          </Description>
        </Vertical>
      </template>
    </Modal>
    <Modal v-if="addingSelectingItem" dialog large @close="addingSelectingItem = false">
      <template v-slot:title> Select Item or Structure </template>
      <template v-slot:contents>
        <Vertical>
          <Header>Items</Header>
          <ItemSelector
            v-model:value="selectedItem"
            :includeNone="false"
            :size="5"
            @selected="addingSelectingItem = false"
          >
            <template v-slot="{ item }">
              <div v-for="action in item.actions" :key="action.actionId">
                <RichText :value="action.label" />
              </div>
            </template>
          </ItemSelector>
          <Header>Structures</Header>
          <StructureSelector
            v-model:value="selectedItem"
            :includeEmpty="false"
            :size="5"
            @selected="addingSelectingItem = false"
          >
            <template v-slot="{ structure }">
              <div v-for="action in structure.actions" :key="action.actionId">
                {{ action.label }}
              </div>
            </template>
          </StructureSelector>
        </Vertical>
      </template>
    </Modal>
    <Modal v-if="adding" dialog @close="adding = false">
      <template v-slot:title> Add Quick Action </template>
      <template v-slot:contents>
        <Vertical>
          <Header>Item or Structure</Header>
          <ListItem flexible>
            <template v-slot:icon>
              <ItemIcon
                :size="6"
                :icon="selectedItem && selectedItem.icon"
                :amount="selectedItem && selectedItem.amount"
                :quality="selectedItem && selectedItem.quality"
                :condition="selectedItem && selectedItem.durabilityStage"
                class="interactive"
                @click="addingSelectingItem = true"
              />
            </template>
            <template v-slot:title>
              <div class="effect-wrap">
                <RichText v-if="selectedItem" :value="selectedItem.name" />
                <div v-else>Nothing selected</div>
              </div>
            </template>
            <template v-slot:subtitle></template>
            <template v-slot:buttons>
              <Button @click="addingSelectingItem = true">Change</Button>
            </template>
          </ListItem>
          <template v-if="selectedItem">
            <Header>Options</Header>
            <Horizontal>
              <Checkbox v-model:value="specificInstance"> Only this specific one </Checkbox>
              <Help title="Specific item or structure">
                By selecting this option the quick action will only apply to this specific piece of
                item or building you selected.
                <br />
                Leaving this unchecked means that any item or structure of the selected type will be
                used automatically, preferring the highest quality and lowest durability.
              </Help>
            </Horizontal>
            <Header>Select Action</Header>
            <div>
              <Radio
                v-for="action in selectedItemActions"
                :key="action.actionId"
                v-model:value="selectedActionId"
                :option="action.actionId"
              >
                <RichText :value="action.label" />
              </Radio>
            </div>
            <Header>Label</Header>
            <div>
              <Input
                v-model:value="newActionLabel"
                :maxLength="32"
                :placeholder="newActionDefaultLabel"
              />
            </div>
          </template>
          <HorizontalCenter>
            <Button :disabled="!selectedItem || !selectedActionId" @click="addQuickAction">
              Add Quick Action
            </Button>
          </HorizontalCenter>
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
import unknownImg from '../../assets/ui/cartoon/icons/unknown_nobg.png'
import isEqual from 'lodash/isEqual.js'
import pageSound from '../../assets/sounds/page.mp3'

export default rxComponent({
  data: () => ({
    showDetails: false,
    settings: false,
    adding: false,
    newActionLabel: '',
    QUICK_ACTIONS_LIMIT,
    selectedItem: null,
    selectedActionId: null,
    addingSelectingItem: false,
    specificInstance: false,
    collapsed: true,
    showCollapseControls: null,
    unknownImg,
  }),

  // watch: {
  //   selectedItem(newValue, oldValue) {
  //     if (newValue?.id !== oldValue?.id && this.selectedItem) {
  //       GameService.getEntityStream(
  //         this.selectedItem.id,
  //         ENTITY_VARIANTS.BASE,
  //         true
  //       );
  //     }
  //   },
  // },

  subscriptions() {
    const quickActionsStream = GameService.getQuickActionsStream()
    return {
      collapsed: LocalStorageService.getItemStream('quickActionsCollapsed', false),
      selectedItemActions: this.$stream('selectedItem')
        .filter((item) => !!item)
        .map((item) => item.id)
        .switchMap((id) => GameService.getEntityStream(id, ENTITY_VARIANTS.BASE, true))
        .pluck('actions'),
      quickActions: quickActionsStream.tap(() => {
        setTimeout(() => {
          this.checkExpandVisibility()
        })
      }),
      validQuickActions: quickActionsStream.map((quickActions) =>
        quickActions.filter(
          (quick) =>
            !!quick &&
            !!quick.item &&
            quick.item.actions.some((a) => a.actionId === quick.actionId),
        ),
      ),
    }
  },

  computed: {
    selectedAction() {
      return this.selectedItemActions?.find((a) => a.actionId === this.selectedActionId)
    },
    newActionDefaultLabel() {
      if (this.selectedAction) {
        return GameService.stripRichText(this.selectedAction.label)
      }
      return ''
    },
  },

  created() {
    this.handler = this.handleResize.bind(this)
    window.addEventListener('resize', this.handler)
  },

  destroyed() {
    window.removeEventListener('resize', this.handler)
  },

  methods: {
    isItem(item) {
      return item.actions.some((a) => a.actionId === 'drop')
    },

    toggleCollapse() {
      LocalStorageService.setItem('quickActionsCollapsed', !this.collapsed)
    },

    handleResize() {
      this.checkExpandVisibility()
    },

    checkExpandVisibility() {
      this.showCollapseControls =
        this.$refs.quickActionContainer &&
        this.$refs.quickActionContainer.scrollWidth > this.$refs.quickActionContainer.clientWidth
    },

    openSettings() {
      this.settings = true
      GameService.checkQuickActions()
      SoundService.playSound(pageSound)
    },

    triggerQuickAction(validQuickAction, max = false) {
      const item = validQuickAction.item
      const action = item.actions.find(({ actionId }) => actionId === validQuickAction.actionId)
      GameService.performAction(item, action, {
        amount: max ? item.amount || 1 : 1,
      })
    },

    startAdding() {
      this.adding = true
      this.newActionLabel = ''
      this.selectedItem = null
      this.selectedActionId = null
      this.specificInstance = false
    },

    async addQuickAction() {
      const quickActions = await ControlsService.getSetting('quickActions', [])
      const action = this.selectedItemActions.find(
        ({ actionId }) => actionId === this.selectedActionId,
      )
      const newQuickAction = {
        actionId: action.actionId,
        label: this.newActionLabel || this.newActionDefaultLabel,
      }
      if (this.specificInstance) {
        newQuickAction.itemId = this.selectedItem.id
      } else {
        newQuickAction.publicId = this.selectedItem.publicId
      }
      if (quickActions.some((action) => isEqual(action, newQuickAction))) {
        ToastError('This action is already added')
        return
      }
      ControlsService.saveSetting('quickActions', [...quickActions, newQuickAction])
        .then(() => {
          this.adding = false
          this.selectedItem = null
          this.selectedActionId = null
        })
        .catch((error) => {
          ToastError(error)
        })
    },

    async removeQuickAction(idx) {
      const quickActions = await ControlsService.getSetting('quickActions', [])
      quickActions.splice(idx, 1)
      await ControlsService.saveSetting('quickActions', quickActions)
    },

    async moveDown(idx) {
      const quickActions = await ControlsService.getSetting('quickActions', [])
      const old = quickActions[idx + 1]
      quickActions[idx + 1] = quickActions[idx]
      quickActions[idx] = old
      await ControlsService.saveSetting('quickActions', quickActions)
    },
    async moveUp(idx) {
      const quickActions = await ControlsService.getSetting('quickActions', [])
      const old = quickActions[idx - 1]
      quickActions[idx - 1] = quickActions[idx]
      quickActions[idx] = old
      await ControlsService.saveSetting('quickActions', quickActions)
    },
  },
})
</script>

<style scoped lang="scss">
@use '../../utils.scss';

$height: 5rem;
$icon-height: 2.5rem;
$border-size: 0.35rem;

.quick-actions {
  margin-left: -1rem - $border-size;
}

.quick-action-label {
  text-align: right;
  font-size: 60%;
  line-height: 1em;
  display: inline-block;
  vertical-align: top;
}

.settings-button {
  padding: 0.5rem calc(($height - $icon-height) / 2 - 0.2rem);
  overflow: hidden;
}

.settings-icon {
  width: $icon-height;
  height: $icon-height;
  background-image: utils.ui-asset('/icons/quick-actions.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  transform: rotate(0deg);
  transition: all 0.1s ease-in-out;
  transition-property: filter, transform;
}

.order-arrow {
  line-height: 2.5rem;

  &.no {
    pointer-events: none;
    visibility: hidden;
  }
}

.quick-action-container {
  margin-left: 0.3rem;
  max-height: calc(1 * var(--app-height) - 30rem);
  overflow: visible;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  &.collapsed {
    overflow: hidden;
  }
}

.collapse-button-wrapper {
  position: absolute;
  left: 100%;
  padding: 0.5rem 0.25rem;

  &:hover {
    cursor: pointer;
    @include utils.filter(brightness(1.2) saturate(1.2));
  }
}

.collapse-button {
  margin: 0.35rem;
  width: 1.4rem;
  height: 1.4rem;
  background-image: utils.ui-asset('/misc/arrow_right.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  transform: rotate(180deg);
  transition: all 0.1s ease-in-out;
  transition-property: filter, transform;
  @include utils.filter(drop-shadow(0.05em -0.05em 0.05em black));

  &.collapsed {
    transform: rotate(0deg);
    @include utils.filter(drop-shadow(0.1em 0.05em 0.05em black));
  }
}
</style>
