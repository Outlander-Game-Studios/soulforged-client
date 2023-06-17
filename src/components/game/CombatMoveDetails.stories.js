import CombatMoveDetails from "./CombatMoveDetails.vue";

export default {
  title: "Game UI/Combat Move Details",
};

export const moveOdds = () => ({
  data: () => ({
    moveDetails: {
      stopsFleeing: true,
    },
  }),

  components: {
    CombatMoveDetails,
  },

  template: `
<div>
  <CombatMoveDetails :moveDetails="moveDetails" :odds="-4" noIcon />
  <CombatMoveDetails :moveDetails="moveDetails" :odds="-3" noIcon />
  <CombatMoveDetails :moveDetails="moveDetails" :odds="-2" noIcon />
  <CombatMoveDetails :moveDetails="moveDetails" :odds="-1" noIcon />
  <CombatMoveDetails :moveDetails="moveDetails" :odds="0" noIcon />
  <CombatMoveDetails :moveDetails="moveDetails" :odds="1" noIcon />
  <CombatMoveDetails :moveDetails="moveDetails" :odds="2" noIcon />
  <CombatMoveDetails :moveDetails="moveDetails" :odds="3" noIcon />
  <CombatMoveDetails :moveDetails="moveDetails" :odds="4" noIcon />
</div>
`,
});
