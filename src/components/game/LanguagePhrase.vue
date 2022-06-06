<template>
  <span>
    <div :class="'language-' + languageCode" v-if="showOriginal">
      <RichText :value="encoded" />
    </div>
    <pre>Using <RichText v-if="language" :value="language.name" />:
<RichText class="language-text" :value="decoded" /></pre>
  </span>
</template>

<script>
export default {
  props: {
    showOriginal: {
      default: false,
    },
    languageCode: {},
    encoded: {},
    decoded: {},
  },

  subscriptions() {
    return {
      language: this.$stream("languageCode")
        .switchMap((languageCode) =>
          GameService.getInfoStream("Language", {
            languageCode,
          })
        )
        .tap((language) => {
          this.createLanguageFontStyle(language);
        }),
    };
  },

  methods: {
    createLanguageFontStyle(language) {
      const id = `language-style-${this.languageCode}`;
      const existing = document.querySelector(`#${id}`);
      if (!existing) {
        const styleElement = document.createElement("style");
        styleElement.setAttribute("id", id);
        styleElement.setAttribute("type", "text/css");
        styleElement.innerText = `
@font-face {
  font-family: Language${this.languageCode};
  src: url(${language.font});
}

.language-${this.languageCode}, .language-${this.languageCode} * { font-family: Language${this.languageCode} }
`;
        document.querySelector("head").appendChild(styleElement);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.language-text {
  font-style: italic;
}

pre {
  white-space: pre-wrap;
}
</style>
