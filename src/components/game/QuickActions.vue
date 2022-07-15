<template>
  <div v-if="inventory && inventory.length">
    <Container v-if="quickActions" :borderSize="0.35" class="quick-actions">
      <Vertical tight>
        <div class="settings-button interactive" @click="settings = true">
          <div class="settings-icon"></div>
        </div>
        <Item
          v-for="(validQuickAction, idx) in validQuickActions"
          :key="idx"
          :data="validQuickAction.item"
          :size="5"
          class="interactive"
          @click="triggerQuickAction(validQuickAction)"
        >
          <template v-slot:textTopRight>
            <span class="quick-action-label">
              {{ validQuickAction.label }}
            </span>
          </template>
        </Item>
      </Vertical>
    </Container>
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
              <Item v-else :size="6" :data="quickAction.item" />
            </template>
            <template v-slot:title>
              {{ quickAction.label }}
            </template>
            <template v-slot:subtitle>
              <RichText
                v-if="quickAction.item"
                :value="quickAction.item.name"
              />
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
                <Button
                  class="order-arrow"
                  :class="{ no: idx === 0 }"
                  @click="moveUp(idx)"
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
            <Button
              @click="startAdding()"
              :disabled="quickActions.length >= QUICK_ACTIONS_LIMIT"
            >
              Add quick action
            </Button>
          </HorizontalCenter>
        </Vertical>
      </template>
    </Modal>
    <Modal
      v-if="addingSelectingItem"
      dialog
      large
      @close="addingSelectingItem = false"
    >
      <template v-slot:title> Select Item or Structure </template>
      <template v-slot:contents>
        <Vertical>
          <Header>Items</Header>
          <ItemSelector
            v-model="selectedItem"
            :includeNone="false"
            :size="5"
            @selected="addingSelectingItem = false"
          >
            <template v-slot="{ item }">
              <div v-for="action in item.actions" :key="action.actionId">
                {{ action.label }}
              </div>
            </template>
          </ItemSelector>
          <Header>Structures</Header>
          <StructureSelector
            v-model="selectedItem"
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
            <Checkbox v-model="specificInstance">
              Only this specific one
              <Help title="Specific item or structure">
                By selecting this option the quick action will only apply to
                this specific piece of item or building you selected.
                <br />
                Leaving this unchecked means that any item or structure of the
                selected type will be used automatically, preferring the highest
                quality and lowest durability.
              </Help>
            </Checkbox>
            <Header>Select Action</Header>
            <div>
              <Radio
                v-for="action in selectedItem.actions"
                :key="action.actionId"
                v-model="selectedActionId"
                :option="action.actionId"
              >
                {{ action.label }}
              </Radio>
            </div>
          </template>
          <HorizontalCenter>
            <Button
              :disabled="!selectedItem || !selectedActionId"
              @click="addQuickAction"
            >
              Add Quick Action
            </Button>
          </HorizontalCenter>
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
import unknownImg from "../../assets/ui/cartoon/icons/unknown_nobg.png";
import isEqual from "lodash/isEqual.js";

export default {
  data: () => ({
    showDetails: false,
    settings: false,
    adding: false,
    QUICK_ACTIONS_LIMIT,
    selectedItem: null,
    selectedActionId: null,
    addingSelectingItem: false,
    specificInstance: false,
    unknownImg,
  }),

  watch: {
    selectedItem(newValue, oldValue) {
      if (newValue?.id !== oldValue?.id && this.selectedItem) {
        GameService.getEntityStream(
          this.selectedItem.id,
          ENTITY_VARIANTS.BASE,
          true
        );
      }
    },
  },

  subscriptions() {
    let mainEntity = GameService.getRootEntityStream();
    const inventoryStream = GameService.getInventoryStream(mainEntity);
    const quickActionsStream = GameService.getQuickActionsStream();
    return {
      inventory: inventoryStream,
      quickActions: quickActionsStream,
      validQuickActions: quickActionsStream.map((quickActions) =>
        quickActions.filter(
          (quick) =>
            !!quick &&
            !!quick.item &&
            quick.item.actions.some((a) => a.actionId === quick.actionId)
        )
      ),
    };
  },

  methods: {
    triggerQuickAction(validQuickAction) {
      const item = validQuickAction.item;
      const action = item.actions.find(
        ({ actionId }) => actionId === validQuickAction.actionId
      );
      GameService.performAction(item, action);
    },

    startAdding() {
      this.adding = true;
      this.selectedItem = null;
      this.selectedActionId = null;
      this.specificInstance = false;
    },

    async addQuickAction() {
      const quickActions = await ControlsService.getSetting("quickActions", []);
      const action = this.selectedItem.actions.find(
        ({ actionId }) => actionId === this.selectedActionId
      );
      const newQuickAction = {
        actionId: action.actionId,
        label: action.label,
      };
      if (this.specificInstance) {
        newQuickAction.itemId = this.selectedItem.id;
      } else {
        console.log(this.selectedItem);
        newQuickAction.publicId = this.selectedItem.publicId;
      }
      if (quickActions.some((action) => isEqual(action, newQuickAction))) {
        ToastError("This action is already added");
        return;
      }
      ControlsService.saveSetting("quickActions", [
        ...quickActions,
        newQuickAction,
      ])
        .then(() => {
          this.adding = false;
          this.selectedItem = null;
          this.selectedActionId = null;
        })
        .catch((error) => {
          ToastError(error);
        });
    },

    async removeQuickAction(idx) {
      const quickActions = await ControlsService.getSetting("quickActions", []);
      quickActions.splice(idx, 1);
      ControlsService.saveSetting("quickActions", quickActions);
    },

    async moveDown(idx) {
      const quickActions = await ControlsService.getSetting("quickActions", []);
      const old = quickActions[idx + 1];
      quickActions[idx + 1] = quickActions[idx];
      quickActions[idx] = old;
      ControlsService.saveSetting("quickActions", quickActions);
    },
    async moveUp(idx) {
      const quickActions = await ControlsService.getSetting("quickActions", []);
      const old = quickActions[idx - 1];
      quickActions[idx - 1] = quickActions[idx];
      quickActions[idx] = old;
      ControlsService.saveSetting("quickActions", quickActions);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

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
  padding: 0.5rem ($height - $icon-height)/2;
  overflow: hidden;
}

.settings-icon {
  width: $icon-height;
  height: $icon-height;
  background-image: url(ui-asset("/icons/quick-actions.png"));
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
</style>
