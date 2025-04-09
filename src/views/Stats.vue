<template>
  <component v-if="component" :is="component" />
</template>

<script>
export default rxComponent({
  data: () => ({
    component: null,
  }),

  subscriptions() {
    return {
      componentData: GameService.getInfoStream('StatsModule', {
        type: 'component',
      }).tap((result) => {
        if (result && result.js) {
          this.loadCss(result.css)
          this.loadJs(result.js, result.componentName)
        }
      }),
    }
  },

  methods: {
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
      const jsId = `js_${md5(js)}`

      const loaded = document.querySelector(`#${jsId}`)
      if (loaded) {
        this.component = componentName
        return
      }
      const fnName = `loaded_${jsId}`
      window[fnName] = () => {
        app.component(componentName, window[componentName])
        this.component = componentName
      }

      const link = document.createElement('script')
      link.setAttribute('id', jsId)
      link.setAttribute('type', 'text/javascript')
      link.setAttribute('onload', `${fnName}()`)
      link.setAttribute('src', `${js}?${GameService.getClientStartupId()}`)
      document.getElementsByTagName('head')[0].appendChild(link)
    },
  },
})
</script>

<style scoped lang="scss"></style>
