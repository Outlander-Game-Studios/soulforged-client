<template>
  <Icon
    @click="mouseClick($event)"
    :src="icon"
    :size="size"
    :text="{
      bottomRight: bottomRightText,
      topRight: topRightText,
    }"
    :customStyle="iconStyle"
    class="item-icon"
  >
    <template>
      <div class="is-equipped-indicator" v-if="isEquipped" />
      <slot />
    </template>
    <template #textBottomRight><slot name="amount" /></template>
    <template #textTopRight>
      <slot name="textTopRight"></slot>
    </template>
  </Icon>
</template>

<script>
import durabilityBorder0 from '../../../assets/ui/cartoon/borders/item-durability-0.jpg'
import durabilityBorder1 from '../../../assets/ui/cartoon/borders/item-durability-1.jpg'
import durabilityBorder2 from '../../../assets/ui/cartoon/borders/item-durability-2.jpg'
import durabilityBorder3 from '../../../assets/ui/cartoon/borders/item-durability-3.jpg'
import iconClickSound from '../../../assets/sounds/icon-click.mp3'

const durabilityBorder = [
  durabilityBorder0,
  durabilityBorder1,
  durabilityBorder2,
  durabilityBorder3,
]

export default {
  props: {
    icon: {},
    amount: {},
    topRightText: {},
    size: {
      default: 5,
    },
    quality: {},
    condition: {},
    isEquipped: {
      type: Boolean,
    },
  },

  data: () => ({}),

  computed: {
    iconStyle() {
      const singleColors = {
        // 0: "#262626",
        // 1: "#4f370f",
        // 2: "#a6a6a6",
        // 3: "#BF953F",
      }
      const colors = {
        0: ['#3a3a3a', '#6b6b6b', '#3a3a3a'],
        1: ['#684135', '#9f8059', '#684135'],
        2: ['#a6a6a6', '#e3e3e3', '#999999'],
        3: ['#a18603', '#d9b800', '#a18603'],
        neutral: ['#ffd195', '#ffedd5', '#ffd195'],
        bad: ['#731919', '#a63737', '#731919'],
        good: ['#3a802a', '#56BF3F', '#3a802a'],
        dark: ['#151515', '#3a3a3a', '#151515'],
      }
      const quality = this.quality !== undefined ? this.quality : 1
      const color = colors[quality]
      const durability = this.condition || 0
      return {
        filter: +durability === 3 ? 'saturate(0)' : undefined,
        'border-image-source': `url("${durabilityBorder[durability]}")`,
        'border-image-slice': 35,
        'background-image': color
          ? `linear-gradient(120deg,  ${color[1]} 3%, ${color[2]} 100%)`
          : 'none',
        'background-color': singleColors[quality] ? singleColors[quality] : null,
        'background-size': '105%',
        fontSize: this.size / 4 + 'rem',
      }
    },

    bottomRightText() {
      if (this.amount && Number.isInteger(this.amount)) {
        return formatNumber(this.amount)
      }
      return this.amount
    },
  },

  methods: {
    formatNumber: global.formatNumber,
    mouseClick($event) {
      if (!!this.$listeners.click) {
        this.$emit('click', $event)
        SoundService.playSound(iconClickSound)
      }
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../../utils.scss';

.item-icon {
  @include utils.filter-fix();
}

.is-equipped-indicator {
  position: absolute;
  top: 3%;
  right: 3%;
  width: 20%;
  height: 20%;
  background: cornflowerblue;
  border: 1px solid #000028;
  border-radius: 50%;
  box-shadow: 0.1rem 0.1rem 0.2rem #444;
  z-index: 1;
}
</style>
