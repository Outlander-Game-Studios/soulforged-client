<template>
  <div>
    <component
      v-if="filteredActions"
      :is="vertical ? 'Vertical' : 'HorizontalCenter'"
      :wrap="!noWrap"
    >
      <div
        v-for="action in filteredActions"
        class="action-button-wrapper"
        :class="{ disabled: disabled }"
      >
        <div v-if="!!$slots[action.actionId]" @click="startAction(action)">
          <slot :name="action.actionId" />
        </div>
        <Button
          v-else
          @click="startAction(action)"
          :disabled="disabled"
          class="action-button"
          :class="action.actionId"
        >
          <RichText
            class="nowrap"
            :value="action.label ? action.label : 'Missing label'"
          />
        </Button>
      </div>
    </component>
    <Modal dialog large v-if="currentAction" @close="closeActionDialog()">
      <template v-slot:title>
        <RichText
          :value="currentAction.label ? currentAction.label : 'Missing label'"
        />
      </template>
      <template v-slot:contents>
        <Vertical class="action-dialog">
          <div v-if="target.unitWeight && parameters.amount">
            <CarryCapacityIndicator :modifier="inventoryWeightChange" />
          </div>
          <component
            v-if="currentAction.extra"
            :is="currentAction.extra.component"
            v-bind="currentAction.extra"
          />
          <div>
            <LoadingPlaceholder
              :size="3.5"
              v-if="actionPoints && calculatingAp"
            />
            <APBar v-else-if="actionPoints" />
          </div>
          <div
            v-for="parameter in currentAction.parameters"
            ref="inputsContainers"
            v-if="!parameterValues[parameter.paramId]"
          >
            <Input
              v-if="
                parameter.type === 'integer' ||
                parameter.type === 'decimal' ||
                parameter.type === 'essence'
              "
              ref="inputs"
              :value="parameters[parameter.paramId]"
              type="number"
              @input="updateParameterValue(parameter, $event)"
              @enter="$refs.submit.click()"
              autoFocus
              :min="parameter.min"
              :max="getMax(parameter)"
            />
            <Input
              v-else-if="parameter.type === 'string'"
              ref="inputs"
              v-model.trim="parameter.value"
              @enter="$refs.submit.click()"
              autoFocus
              type="text"
            />
            <pre
              v-else-if="parameter.type === 'message'"
              class="empty-text message"
              v-html="parameter.text"
            />
            <div v-else-if="parameter.type === 'item'">
              <ItemSelector
                v-model="selectedItem"
                @input="updateItemValue(parameter, $event)"
                :includeNone="false"
                :size="5"
                withText
              />
            </div>
            <div v-else>Missing implementation: {{ parameter }}</div>
          </div>
          <Button
            @click="performAction(currentAction)"
            ref="submit"
            :processing="performing"
          >
            {{ confirmLabel }}
          </Button>
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
import exclamationIcon from "../../assets/ui/cartoon/icons/exclamation.png";
import LoadingPlaceholder from "../interface/LoadingPlaceholder";

export default {
  components: { LoadingPlaceholder },
  props: {
    target: Object,
    vertical: {
      type: Boolean,
    },
    confirmLabel: {
      default: "Confirm",
    },
    noWrap: {
      type: Boolean,
    },
    actionId: {},
    parameterValues: {
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
    },
    customActionHandler: {},
  },

  data() {
    return {
      calculatingAp: false,
      selectedItem: null,
      parameters: {},
      currentAction: null,
      performing: null,
    };
  },

  subscriptions() {
    return {
      actionPoints: Rx.combineLatest(
        this.$stream("currentAction"),
        this.$stream("parameters"),
        this.$stream("target"),
        GameService.getRootEntityStream()
      )
        .distinctUntilChanged(null, JSON.stringify)
        .filter(([currentAction]) => !!currentAction)
        .tap(() => (this.calculatingAp = true))
        .debounceTime(200)
        .switchMap(([currentAction, parameters, target]) =>
          Rx.fromPromise(
            GameService.request(REQUEST_CODES.ACTION_COST, {
              targetId: target.id,
              actionId: currentAction.actionId,
              parameters,
            })
          )
        )
        .filter((result) => result && result.ok)
        .map((result) => result.ap)
        .tap((ap) => {
          this.calculatingAp = false;
          this.setConsideredAP(ap);
        }),
    };
  },

  computed: {
    filteredActions() {
      if (!this.target || !this.target.actions) {
        return [];
      }
      if (!this.actionId) {
        return this.target.actions;
      }
      const onlyAction = this.target.actions.find(
        (a) => a.actionId === this.actionId
      );
      if (!onlyAction) {
        return [];
      }
      return [onlyAction];
    },

    inventoryWeightChange() {
      if (!this.currentAction || !this.target) {
        return 0;
      }
      let multiplier;
      switch (this.currentAction.actionId) {
        case "pickup":
        case "loot":
          multiplier = 1;
          break;
        case "drop":
          multiplier = -1;
          break;
        default:
          return 0;
      }
      return this.target.unitWeight * this.parameters.amount * multiplier;
    },
  },

  methods: {
    updateItemValue(parameter, value) {
      this.parameters = {
        ...this.parameters,
        [parameter.paramId]: value.id,
      };
    },
    updateParameterValue(parameter, value) {
      this.parameters = {
        ...this.parameters,
        [parameter.paramId]: value,
      };
    },

    getMax(parameter) {
      if (parameter.paramId === "amount" && this.selectedItem) {
        return this.selectedItem.amount;
      }
      return parameter.max;
    },
    startAction(action) {
      if (!action.parameters?.length && !action.actionPoints && !action.extra) {
        this.performAction(action);
        return;
      }
      this.currentAction = action;
      this.parameters = (action.parameters || []).reduce(
        (acc, param) => ({
          [param.paramId]: param.default,
          ...acc,
        }),
        {}
      );
    },
    setConsideredAP(value) {
      if (this.lastConsideredAP !== undefined) {
        ControlsService.updateConsideredAP(value);
      } else {
        ControlsService.getConsideredAPStream()
          .first()
          .subscribe((current) => {
            this.lastConsideredAP = current;
            ControlsService.updateConsideredAP(value);
          });
      }
    },
    performAction(action) {
      const parameters = {
        ...this.parameters,
        ...this.parameterValues,
      };
      if (this.customActionHandler) {
        return this.customActionHandler(action, parameters);
      }
      console.log(
        "Perform action",
        JSON.stringify(action),
        JSON.stringify(parameters)
      );
      this.performing = GameService.performAction(
        this.target,
        action,
        parameters
      ).then((response) => {
        if (response && response.ok) {
          this.closeActionDialog();
          this.$emit("action", { action, result: response.result });
          if (action.actionId === "trade") {
            ControlsService.triggerControlEvent("openPanel-trade");
          }
        }
      });
    },
    closeActionDialog() {
      this.currentAction = null;
      if (this.lastConsideredAP !== undefined) {
        this.setConsideredAP(this.lastConsideredAP);
      }
    },
  },
};
</script>

<style lang="scss">
@import "../../utils.scss";

.action-button-wrapper.disabled {
  pointer-events: none;
}

.action-dialog {
  .message {
    white-space: normal;

    em {
      font-weight: bold;
    }
  }
}
</style>
