<template>
  <div>
    <CloseButton class="close-button" @click="cancel()" />
    <Vertical>
      <Header>
        Wait
        <Help title="Waiting">
          Spending Action Points by waiting allows you very fine control of amount of Action Points
          spent to wait out specific effects.<br />
          <br />
          Waiting has <em>no impact</em> on the effects that are applied to your character. It
          <em>does not</em> speed up recovery in any way.
        </Help>
      </Header>
      <Description> Spend action points without doing anything. </Description>
      <HorizontalCenter>How long?</HorizontalCenter>
      <Input
        type="number"
        v-model="amount"
        ref="inputField"
        :max="max"
        @enter="$refs.submit.click()"
        autoFocus
      />
      <Header small alt2 v-if="effects && effects.length">
        Wait out effects
        <Help title="Wait out effects">
          You may want to wait for specific wounds or other effects to wear off.
          <br />
          <br />
          This interface provides a quick way to do that - simply click the amount of Action Points
          you want to spend to fill in the input box and then confirm by clicking commence.
        </Help>
      </Header>
      <Vertical tight>
        <Horizontal v-for="(effect, idx) in effects" :key="idx">
          <EffectIcon :effect="effect" :size="2.8" />
          <RichText :value="effect.name" />
          <div class="flex-grow" />
          <div v-if="effect.duration.length > 1">
            <span>
              <span class="ap-label">min: </span>
              <span class="click-duration" @click="skipTime(effect.duration[0])"
                >{{ effect.duration[0] }} AP</span
              >
            </span>
            <span>
              <span class="ap-label"> max: </span>
              <span class="click-duration" @click="skipTime(effect.duration[1])"
                >{{ effect.duration[1] }} AP</span
              >
            </span>
          </div>
          <div v-else class="click-duration" @click="skipTime(effect.duration[0])">
            {{ effect.duration[0] }} AP
          </div>
        </Horizontal>
      </Vertical>
      <HorizontalCenter>
        <Button ref="submit" @click="commence()" :processing="processing">Commence</Button>
      </HorizontalCenter>
    </Vertical>
  </div>
</template>

<script>
const OperationWait = {
  props: {
    operation: {},
  },

  data: () => ({
    amount: 1,
    max: 100,
    processing: false,
  }),

  watch: {
    operation() {
      this.updateConsideredAP()
    },
    amount() {
      this.updateConsideredAP()
    },
  },

  subscriptions() {
    return {
      mainEntity: GameService.getRootEntityStream(),
      effects: GameService.getRootEntityStream().map((entity) =>
        entity.effects
          .filter((effect) => !!effect.duration)
          .filter((effect) => effect.order !== 5)
          .map((effect) => ({
            ...effect,
            duration: Array.isArray(effect.duration) ? effect.duration : [effect.duration],
          }))
          .map((effect) => ({
            ...effect,
            duration:
              effect.duration[0] === effect.duration[1] ? [effect.duration[0]] : effect.duration,
          })),
      ),
    }
  },

  mounted() {
    this.updateConsideredAP()
  },

  beforeDestroy() {
    ControlsService.updateConsideredAP(0)
  },

  methods: {
    commence() {
      this.processing = GameService.request(REQUEST_CODES.COMMENCE_OPERATION, {
        amount: this.amount,
      }).then(({ amount, statusChanges = [] } = {}) => {
        this.amount = amount
        ToastNotify(statusChanges)
      })
    },

    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION)
    },

    updateConsideredAP() {
      ControlsService.updateConsideredAP(this.operation.context.unitCost * this.amount)
    },

    skipTime(seconds) {
      this.amount = seconds
      this.max = Math.max(100, seconds)
      this.$refs.inputField.focus()
    },
  },
}
window.OperationWait = OperationWait
export default OperationWait
</script>

<style scoped lang="scss">
.ap-label {
  font-size: 85%;
  font-style: italic;
  color: #555;
}
.click-duration {
  text-decoration: underline;
  cursor: pointer;
}
</style>
