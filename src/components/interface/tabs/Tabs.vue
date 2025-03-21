<template>
  <div class="tabs" :class="['placement-' + placement, { 'full-height': fullHeight }]">
    <div class="tab-headers">
      <div
        v-for="(tab, idx) in tabs"
        class="tab-header"
        :class="{ active: tab === lastTab }"
        @click="toggleTab(tab)"
        :title="tab.title"
      >
        <Container
          class="tab-header-container"
          :bottom="placement !== POSITION.TOP || (allowEmpty && !lastTab)"
          :right="placement !== POSITION.LEFT || (allowEmpty && !lastTab)"
          :left="placement !== POSITION.RIGHT || (allowEmpty && !lastTab)"
          :top="placement !== POSITION.BOTTOM || (allowEmpty && !lastTab)"
          :borderSize="borderSize"
          :borderType="borderType"
          :backgroundType="backgroundType"
        >
          <div class="tab-header-content" :class="{ indent: !!lastTab }">
            <slot :name="'header:' + tab.tabId"></slot>
            <div v-if="!$slots['header:' + tab.tabId]">
              {{ tab.header }}
            </div>
            <transition name="fade">
              <div class="indicator" :class="tab.indicatorStyle" v-if="tab.indicator">
                <BorderRound
                  :size="2.2"
                  borderType="tightGlow"
                  :backgroundType="tab.indicatorStyle"
                >
                  <div class="indicator-content">
                    {{ tab.indicator }}
                  </div>
                </BorderRound>
              </div>
            </transition>
          </div>
        </Container>
      </div>
    </div>
    <div v-show="lastTab" class="tab-contents" :style="{ margin: -borderSize + 'rem' }">
      <Container
        class="tab-container"
        :class="{ flex: flex }"
        :borderSize="borderSize"
        :borderType="borderType"
        :backgroundType="backgroundType"
      >
        <slot></slot>
      </Container>
    </div>
  </div>
</template>

<script>
const POSITION = {
  TOP: 'top',
  LEFT: 'left',
  RIGHT: 'right',
  BOTTOM: 'bottom',
}

global.Tabs = {
  POSITION,
}
export default {
  props: {
    placement: {
      default: POSITION.TOP,
    },
    rememberTabId: {},
    url: {
      default: 'tab',
    },
    fullHeight: {
      default: true,
    },
    flex: {
      type: Boolean,
    },
    allowEmpty: {
      default: false,
    },
    borderSize: {
      default: 0.5,
    },
    borderType: {
      default: 'base',
      validator: PropValidator.oneOf(['base', 'alt']),
    },
    backgroundType: {
      default: 'base',
      validator: PropValidator.oneOf(['base', 'alt']),
    },
  },

  data: () => ({
    POSITION,
    tabs: [],
    lastTab: null,
  }),

  mounted() {
    if (this.url) {
      const startingTab = this.$router.currentRoute?.value?.query?.[this.url]
      if (startingTab) {
        const tab = this.tabs.find((tab) => tab.header === startingTab) || this.tabs[0]
        this.setActive(tab)
      }
    }
    if (this.rememberTabId) {
      const startingTab = localStorage.getItem(`tabsAutoOpen.${this.rememberTabId}`)
      if (startingTab) {
        const tab = this.tabs.find((tab) => tab.tabId === startingTab) || this.tabs[0]
        this.setActive(tab)
      }
    }
  },

  methods: {
    updateTab(compVm) {
      const tab = this.tabs.find((t) => t.compVm === compVm)
      tab.indicator = compVm.indicator
      tab.indicatorStyle = compVm.indicatorStyle
    },

    registerTab(idx, header, setActiveCallback, compVm) {
      const { title, indicator, indicatorStyle } = compVm
      this.tabs.splice(idx, 0, {
        tabId: header.replace(/ /g, '_'),
        header: header,
        callback: setActiveCallback,
        title,
        indicator,
        indicatorStyle,
        compVm,
      })
      if (!this.lastTab && !this.allowEmpty) {
        this.lastTab = this.tabs[0]
        if (this.lastTab) {
          this.lastTab.callback(true)
        }
      }
    },

    unregisterTab(header) {
      const idx = this.tabs.findIndex((t) => t.header === header)

      if (idx !== -1) {
        const needToActivate = this.lastTab === this.tabs[idx]
        this.tabs.splice(idx, 1)
        if (needToActivate) {
          this.lastTab = this.tabs[0]
          if (this.lastTab) {
            this.lastTab.callback(true)
          }
        }
      }
    },

    closeTab() {
      if (this.lastTab) {
        this.toggleTab(this.lastTab)
      }
    },

    toggleTab(tab) {
      if (this.allowEmpty && this.lastTab === tab) {
        if (this.lastTab) {
          this.lastTab.callback(false)
        }
        this.lastTab = null
        localStorage.setItem(`tabsAutoOpen.${this.rememberTabId}`, null)
        if (this.url) {
          this.$router.push({
            query: { ...(this.$route.query || {}), [this.url]: null },
          })
        }
        this.$emit('change', null)
        return
      }
      this.setActive(tab)
    },

    setActive(tab) {
      if (this.lastTab) {
        this.lastTab.callback(false)
      }
      tab.callback(true)
      this.lastTab = tab
      if (this.rememberTabId) {
        localStorage.setItem(`tabsAutoOpen.${this.rememberTabId}`, tab.tabId)
      }
      if (this.url) {
        if (this.$route.query[this.url] !== tab.header) {
          this.$router.push({
            query: { ...(this.$route.query || {}), [this.url]: tab.header },
          })
        }
      }
      this.$emit('change', tab)
    },

    setActiveByComponent(cmp) {
      const tab = this.tabs.find((t) => t.header === cmp.header)

      if (tab) {
        this.setActive(tab)
      }
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../../utils.scss';

.tabs {
  display: flex;
  max-height: 100%;
  position: relative;

  .tab-header-container {
    overflow: hidden;
  }

  &.full-height {
    height: 100%;
  }

  .tab-headers {
    pointer-events: all;
    display: flex;

    .tab-header {
      white-space: nowrap;
      position: relative;

      .tab-header-content {
        padding: 0.75rem;
      }

      &.active {
        z-index: 2;
      }

      @include utils.interactive();
      //&:not(.active) {
      //  @include utils.interactive();
      //}

      .indicator {
        position: absolute;
        text-align: center;
        vertical-align: baseline;
        border-radius: 50%;
        z-index: 1;
        transition: all 0.2s linear;

        &.important {
          animation: blink 0.6s infinite;
        }
      }
    }
  }

  .tab-contents {
    pointer-events: all;
    flex-grow: 1;
    flex-shrink: 10000;
    z-index: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;

    .tab-container {
      flex-grow: 1;

      &.flex {
        display: flex;
      }
    }
  }

  &.placement-top {
    flex-direction: column;

    .tab-headers {
      margin-left: 1rem;

      .tab-header-content.indent {
        padding-bottom: 1.5rem;
      }

      .tab-header {
        &.active {
          border-bottom-color: transparent;
        }

        .indicator {
          top: -0.25rem;
          right: -0.25rem;
        }
      }
    }

    .tab-contents {
      margin-left: 0 !important;
      margin-right: 0 !important;
      margin-bottom: 0 !important;
    }
  }

  &.placement-bottom {
    flex-direction: column-reverse;
    width: 100%;

    .tab-headers {
      margin-left: 1rem;

      .tab-header-content.indent {
        padding-top: 1.5rem;
      }

      .tab-header {
        &.active {
          border-bottom-color: transparent;
        }

        .indicator {
          bottom: 0.25rem;
          right: 0.25rem;
        }
      }
    }

    .tab-contents {
      margin-left: 0 !important;
      margin-right: 0 !important;
      margin-top: 0 !important;
    }
  }

  &.placement-right {
    flex-direction: row-reverse;

    .tab-headers {
      margin-top: 1rem;
      flex-direction: column;

      .tab-header-content.indent {
        padding-left: 1.5rem;
      }

      .tab-header {
        &.active {
          border-left-width: 0;
        }

        .indicator {
          bottom: 0.25rem;
          right: 0.25rem;
        }
      }
    }

    .tab-contents {
      margin-top: 0 !important;
      margin-left: 0 !important;
      margin-bottom: 0 !important;
    }
  }

  &.placement-left {
    flex-direction: row;

    .tab-headers {
      margin-top: 1rem;
      flex-direction: column;

      .tab-header-content.indent {
        padding-right: 1.5rem;
      }

      .tab-header {
        &.active {
          border-right-width: 0;
        }

        .indicator {
          bottom: 0.25rem;
          left: 0.25rem;
        }
      }
    }

    .tab-contents {
      margin-top: 0 !important;
      margin-right: 0 !important;
      margin-bottom: 0 !important;
    }
  }

  .indicator-content {
    font-size: 66%;
    padding-top: 0.1em;
  }
}
</style>
