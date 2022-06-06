<template>
  <div class="skill-bar interactive" @click="showDetails = true">
    <LabeledValue :label="skillName + ' ' + extras" flex>
      {{ skillSign }}{{ skillLevelFloor || 0 }}.<span class="fraction">{{
        fractionTwoDigits
      }}</span>
    </LabeledValue>
    <ProgressBar :current="percentage" :size="0.6" color="blue" />
    <Modal
      v-if="showDetails"
      dialog
      large
      @close="showDetails = false"
      :title="skillName"
    >
      <SkillDetails :skillName="skillName" />
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    skillName: {},
    skillLevel: {},
    extras: {
      default: "",
    },
  },

  data: () => ({
    showDetails: false,
  }),

  computed: {
    skillSign() {
      return Math.sign(this.skillLevel) < 0 ? "-" : "";
    },
    skillLevelFloor() {
      return Math.floor(Math.abs(this.skillLevel) || 0);
    },
    percentage() {
      return Math.round((this.skillLevel - Math.floor(this.skillLevel)) * 100);
    },
    fractionTwoDigits() {
      const fraction = Math.abs(
        Math.round(
          (this.skillLevel -
            Math.sign(this.skillLevel) * this.skillLevelFloor) *
            100
        )
      );
      if (fraction >= 100) {
        return "99";
      }
      return fraction >= 10 ? fraction : "0" + (fraction || 0);
    },
  },
};
</script>

<style scoped lang="scss">
.skill-bar {
  padding: 0.4rem 0;
}
.fraction {
  font-size: 55%;
}
</style>
