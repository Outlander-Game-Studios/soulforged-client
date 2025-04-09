<template>
  <span> {{ displayTimeRemaining }} </span>
</template>

<script>
export default {
  props: {
    seconds: {},
    up: {
      type: Boolean,
      default: false,
    },
    short: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    timeRemaining: null,
  }),

  watch: {
    seconds: {
      handler(value) {
        this.timeRemaining = value
      },
      immediate: true,
    },
  },

  computed: {
    displayTimeRemaining() {
      const days = Math.floor(this.timeRemaining / DAYS)
      const hours = Math.floor(this.timeRemaining / HOURS) % 24
      const minutes = Math.floor(this.timeRemaining / MINUTES) % 60
      const seconds = this.timeRemaining % 60
      const dayLabel = dynamicPluralize('day', days)
      const hourLabel = dynamicPluralize('hour', hours)
      const minLabel = this.short ? 'min' : dynamicPluralize('minute', minutes)
      const secLabel = this.short ? 'sec' : dynamicPluralize('second', seconds)
      let result = ''
      result += days >= 1 ? `${days} ${dayLabel} ` : ''
      result += hours >= 1 ? `${hours} ${hourLabel} ` : ''
      result += minutes >= 1 ? `${minutes} ${minLabel} ` : ''
      result += ` ${seconds} ${secLabel}`
      return result
    },
  },

  mounted() {
    global.x = this
    this.interval = setInterval(() => {
      this.timeRemaining += this.up ? 1 : -1
    }, 1000)
  },

  beforeUnmount() {
    clearInterval(this.interval)
  },
}
</script>

<style scoped lang="scss"></style>
