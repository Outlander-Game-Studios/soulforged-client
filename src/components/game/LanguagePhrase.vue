<template>
  <span>
    <Horizontal>
      <Header alt2 small> Using <RichText v-if="language" :value="language.name" /> </Header>
    </Horizontal>
    <pre><template v-for="(part, idx) in parts"><span :class="part.obfuscated ? ['language-' + languageCode, 'obfuscated'] : []"><RichText :value="part.text" /></span></template></pre>
  </span>
</template>

<script>
import flatten from 'lodash/flatten.js'

export default rxComponent({
  props: {
    languageCode: {},
    text: {},
  },

  computed: {
    parts() {
      return flatten(
        this.text.split('」').map((item) => {
          const [first, second] = item.split('「')
          return [
            {
              obfuscated: false,
              text: first,
            },
            {
              obfuscated: true,
              text: second,
            },
          ]
        }),
      )
    },
  },

  subscriptions() {
    return {
      language: this.$stream('languageCode')
        .switchMap((languageCode) =>
          GameService.getInfoStream('Language', {
            languageCode,
          }),
        )
        .tap((language) => {
          this.createLanguageFontStyle(language)
        }),
    }
  },

  methods: {
    createLanguageFontStyle(language) {
      const id = `language-style-${this.languageCode}`
      const existing = document.querySelector(`#${id}`)
      if (!existing) {
        const styleElement = document.createElement('style')
        styleElement.setAttribute('id', id)
        styleElement.setAttribute('type', 'text/css')
        styleElement.innerText = `
@font-face {
  font-family: Language${this.languageCode};
  src: url(${language.font});
}

.language-${this.languageCode}, .language-${this.languageCode} * { font-family: Language${this.languageCode}; visibility: visible !important; }
`
        document.querySelector('head').appendChild(styleElement)
      }
    },
  },
})
</script>

<style scoped lang="scss">
.obfuscated {
  color: #ac836b;
  visibility: hidden;
}

.language-text {
  font-style: italic;
}

pre {
  white-space: pre-wrap;
}
</style>
