<template>
  <div>
    <span v-for="(part, idx) in parts" :key="idx">
      <span v-if="part.language === undefined">
        <RichText :value="part.text" />
      </span>
      <span v-else>
        <LanguagePhrase :languageCode="part.language" :text="part.text" />
      </span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    value: {},
  },

  computed: {
    parts() {
      if (!this.value) {
        return [];
      }
      return `${this.value}`.split("⁆").reduce((acc, part) => {
        const [first, second = ""] = part.split("⁅");
        acc.push({
          text: first,
        });
        if (second) {
          const [language, text] = second.split("⍡");
          acc.push({
            language,
            text,
          });
        }
        return acc;
      }, []);
    },
  },
};
</script>

<style scoped lang="scss"></style>
