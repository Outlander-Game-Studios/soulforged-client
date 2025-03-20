<template>
  <div>
    <div class="ap interactive" @click="mouseClick()">
      <Container :borderSize="0.5" backgroundType="alt" class="label" :right="false">
        AP
      </Container>
      <div class="flex-grow">
        <APBar :AP="AP" :maxAP="maxAP" :consideredAP="consideredAP" :leftBorder="false" />
      </div>
    </div>
    <Modal dialog large v-if="showDetails" @close="showDetails = false">
      <Vertical class="ap-modal-contents">
        <Header>Action points</Header>
        <APBar :AP="AP" :maxAP="maxAP" :consideredAP="consideredAP" />
        <div>
          <LabeledValue label="Current"> {{ AP }} AP </LabeledValue>
          <LabeledValue label="AP limit"> {{ maxAP }} AP </LabeledValue>
        </div>
        <LabeledValue v-if="consideredAP" label="Current action cost">
          {{ consideredAP === Infinity ? 'Impossible' : consideredAP + ' AP' }}
        </LabeledValue>
        <div>
          <LabeledValue label="Gaining">
            {{ mainEntity.nextAP.gain }} AP every {{ mainEntity.nextAP.interval }} minutes
          </LabeledValue>
          <LabeledValue label="Next gain in">
            <Countdown :seconds="nextTickSeconds" />
          </LabeledValue>
          <LabeledValue label="Max action points on">
            {{ fullAPWhen }}
          </LabeledValue>
        </div>
      </Vertical>
    </Modal>
  </div>
</template>

<script>
import pageSound from '../../assets/sounds/page.mp3'
import promptSound from '../../assets/sounds/prompt2.mp3'

export default {
  data: () => ({
    hideCurrent: false,
    showDetails: false,
    lastUpdated: null,
    dialogOpenedOn: null,
  }),

  subscriptions() {
    const consideredAPStream = ControlsService.getConsideredAPStream()
    const APStream = GameService.getRootEntityStream().pluck('actionPoints')
    return {
      mainEntity: GameService.getRootEntityStream().tap((entity) => {
        this.dialogOpenedOn = new Date()
        this.lastUpdated = entity.updatedOn
      }),
      consideredAP: Rx.combineLatest(consideredAPStream, APStream).map(([consideredAP, AP]) => {
        const APminutes = AP / 60
        const APfraction = APminutes - Math.floor(APminutes)
        if (consideredAP < 60) {
          return Math.round((100 * consideredAP) / 60) / 100
        }
        const value = consideredAP / 60 - APfraction
        return Math.ceil(value)
      }),
      AP: APStream.map((value) => Math.floor(value / 60))
        .distinctUntilChanged()
        .tap((value) => {
          if (this.consideredAP && this.AP < this.consideredAP && value >= this.consideredAP) {
            SoundService.playNotificationSound('ap-cost', 0, promptSound)
          }
        }),
      maxAP: GameService.getRootEntityStream()
        .pluck('actionPointsMax')
        .map((value) => Math.floor(value / 60)),
    }
  },

  computed: {
    nextTickSeconds() {
      return (
        this.mainEntity.nextAP.nextTickSeconds -
        Math.floor((this.dialogOpenedOn - this.lastUpdated) / 1000)
      )
    },

    fullAPWhen() {
      if (!this.mainEntity.nextAP) {
        return '?'
      }
      const { gain, interval, nextTickSeconds } = this.mainEntity.nextAP
      const APMissing = this.maxAP - this.AP
      const ticksTillFull = Math.ceil(APMissing / gain) - 1
      const secondsTillFull = ticksTillFull * interval * 60 + nextTickSeconds
      const dateFull = new Date(this.lastUpdated)
      dateFull.setTime(dateFull.getTime() + secondsTillFull * IN_MILISECONDS)
      return dateFull.toLocaleTimeString() + ', ' + DAYS_OF_WEEK[dateFull.getDay()]
    },

    consideredStyle() {
      const currentRatio = (this.AP / this.maxAP) * 100
      const consideredRatio = (this.consideredAP / this.maxAP) * 100
      const min = 8

      const minWidth = Math.max(min, consideredRatio)
      const right = 100 - Math.min(100, Math.max(minWidth, currentRatio, consideredRatio))

      this.hideCurrent = right > 60

      return {
        minWidth: `${Math.min(100, minWidth)}%`,
        right: `${right}%`,
      }
    },

    fills() {
      const currentRatio = (this.AP / this.maxAP) * 100
      const consideredRatio = (this.consideredAP / this.maxAP) * 100
      if (currentRatio < consideredRatio) {
        return {
          orange: currentRatio,
          red: consideredRatio - currentRatio,
        }
      }
      return {
        darkBlue: currentRatio - consideredRatio,
        blue: consideredRatio,
      }
    },
  },

  mounted() {
    this.interval = setInterval(() => {
      this.secondsRemaining -= 1
    }, 1000)
  },

  beforeDestroy() {
    clearInterval(this.interval)
  },

  methods: {
    mouseClick() {
      SoundService.playSound(pageSound)
      this.dialogOpenedOn = new Date()
      this.showDetails = true
    },
  },
}
</script>

<style scoped lang="scss">
@import '../../utils.scss';

.ap {
  margin-left: auto;
  display: flex;

  .label {
    height: 3.5rem;
    padding: 0.3rem 0.4rem;
    font-size: 85%;
    overflow: hidden;
  }
}

.ap-modal-contents {
  min-width: 28rem;
}
</style>
