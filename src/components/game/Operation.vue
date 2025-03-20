<template>
  <div v-if="loadedComponentName && mainEntity && mainEntity.operation">
    <div v-if="!fullscreenOperation" class="overlay" :class="{ 'map-centered': mapCentered }">
      <component
        v-if="mapCentered"
        :is="componentName"
        :key="mainEntity.operation.operationId"
        :operation="operation"
      />
      <Container v-else class="overlay-container" borderType="alt" :borderSize="1.5">
        <Spaced>
          <component
            v-if="componentName && loadedComponents[componentName]"
            :is="componentName"
            :key="mainEntity.operation.operationId"
            :operation="operation"
          />
        </Spaced>
      </Container>
    </div>
    <div v-else>
      <component
        v-if="componentName && loadedComponents[componentName]"
        :is="componentName"
        :key="mainEntity.operation.operationId"
        :operation="operation"
      />
    </div>
  </div>
</template>

<script>
const loadedComponents = {}
export default {
  data: () => ({
    componentName: null,
    loadedComponents,
  }),

  subscriptions() {
    return {
      fullscreenOperation: ControlsService.getFullscreenOperationStream(),
      mainEntity: GameService.getRootEntityStream(),
      operation: GameService.getRootEntityStream()
        .pluck('operation')
        .tap((operation) => {
          if (!operation) {
            this.componentName = null
            return
          }
          if (this.componentName !== operation.files.componentName) {
            this.componentName = operation.files.componentName
            this.loadFiles(operation.files)
            this.closeTabsIfNeeded()
          }
        }),
    }
  },

  computed: {
    loadedComponentName() {
      const result =
        this.componentName && this.loadedComponents[this.componentName]
          ? window[this.componentName]
          : null
      if (result) {
        ControlsService.toggleFullscreenOperation(!!result.FULLSCREEN)
      } else {
        ControlsService.toggleFullscreenOperation(false)
      }
      return result
    },

    mapCentered() {
      return this.mainEntity?.operation?.context?.mapCentered
    },
  },

  methods: {
    closeTabsIfNeeded() {
      if (this.mapCentered) {
        return
      }
      const width = getScreenWidth()
      const height = getScreenHeight()
      if (width > height) {
        // landscape
        return
      }
      ControlsService.triggerControlEvent('closePanel')
    },

    loadFiles({ js, css, assets, componentName }) {
      GameService.registerSecureAssets(assets)
      this.loadCss(css)
      this.loadJs(js, componentName)
    },

    loadCss(css) {
      if (!css) {
        return
      }
      const cssId = `css_${md5(css)}`
      const loaded = document.querySelector(`#${cssId}`)
      if (loaded) {
        return
      }
      const link = document.createElement('link')
      link.setAttribute('id', cssId)
      link.setAttribute('rel', 'stylesheet')
      link.setAttribute('type', 'text/css')
      link.setAttribute('href', `${css}?${GameService.getClientStartupId()}`)
      document.getElementsByTagName('head')[0].appendChild(link)
    },

    loadJs(js, componentName) {
      if (!js) {
        // Stories only
        this.$set(this.loadedComponents, componentName, true)
        return
      }
      const jsId = `js_${md5(js)}`

      const loaded = document.querySelector(`#${jsId}`)
      if (loaded) {
        return
      }
      const fnName = `loaded_${jsId}`
      window[fnName] = () => {
        global.app.component(componentName, window[componentName])
        this.$set(this.loadedComponents, componentName, true)
      }

      if (!!window[componentName]) {
        return window[fnName]()
      }

      const link = document.createElement('script')
      link.setAttribute('id', jsId)
      link.setAttribute('type', 'text/javascript')
      link.setAttribute('onload', `${fnName}()`)
      link.setAttribute('src', `${js}?${GameService.getClientStartupId()}`)
      document.getElementsByTagName('head')[0].appendChild(link)
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.overlay {
  //@include utils.filter(drop-shadow(0.3rem 0.3rem 0.3rem black));
  display: flex;

  &:not(.map-centered) {
    $overlay-spacing: calc(0.03 * var(--app-min-size));
    position: fixed;
    z-index: 5;
    bottom: $overlay-spacing;
    left: $overlay-spacing;
    margin-left: 3rem;
    pointer-events: all;

    @media (orientation: portrait) {
      bottom: initial;
      left: initial;
      right: $overlay-spacing;
      top: calc(8rem + #{$overlay-spacing});
    }
  }

  &.map-centered {
    max-height: 100%;
    max-width: 100%;
    display: flex;
    justify-content: center;
  }
}

.overlay-container {
  max-height: calc(var(--app-height) - 12.5rem) !important;
  max-width: calc(var(--app-width) - 2rem) !important;

  @include utils.FirefoxOnly() {
    overflow-y: scroll !important;
  }
}
</style>
