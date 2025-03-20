import { components } from 'storybook/internal/components'
import ProgressBar from './ProgressBar.vue'

export default {
  title: 'Base UI/ProgressBar',
}

const factory =
  (current = undefined, fills) =>
  () => {
    return {
      components: {
        ProgressBar,
      },
      data: () => ({
        current,
        fills,
      }),
      template: `<ProgressBar :current="current" :fills="fills" />`,
    }
  }

export const empty = factory(0)
export const third = factory(33.33)
export const half = factory(50)
export const full = factory(100)
export const overflow = factory(200)
export const fullTwo = factory(undefined, {
  yellow: 90,
  cyan: 10,
})
export const threeSteps = factory(undefined, {
  yellow: 10,
  red: 33,
  blue: 20,
})
export const allColors = factory(undefined, {
  blue: 10,
  cyan: 10,
  green: 10,
  yellow: 10,
  orange: 10,
  red: 10,
})

const animationStages = [
  { blue: 0, yellow: 10, red: 30 },
  { blue: 0, yellow: 30, red: 10 },
  { blue: 0, yellow: 15, red: 5 },
  { blue: 20, yellow: 15, red: 5 },
  { blue: 50, yellow: 15, red: 5 },
  { blue: 80, yellow: 15, red: 5 },
  { cyan: 80, yellow: 15, red: 5 },
]
export const animated = () => {
  return {
    data: () => ({
      stage: 0,
      fills: animationStages[0],
    }),
    created() {
      this.interval = setInterval(() => {
        this.stage = (this.stage + 1) % animationStages.length
        this.fills = animationStages[this.stage]
      }, 1000)
    },
    destroyed() {
      clearInterval(this.interval)
    },
    template: `<ProgressBar :fills="fills" />`,
  }
}

export const sizes = () => {
  return {
    data: () => ({
      current: 33,
    }),
    template: `
<div>
  <ProgressBar :current="current" :size="1" />
  <ProgressBar :current="current" :size="2" />
  <ProgressBar :current="current" :size="3" />
  <ProgressBar :current="current" :size="5" />
  <ProgressBar :current="current" :size="10" />
  <ProgressBar :current="current" :size="20" />
</div>
`,
  }
}
