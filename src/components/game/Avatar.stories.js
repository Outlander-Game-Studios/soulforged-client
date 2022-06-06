import { Rx } from "@/rx.js";
import avatarAssets from "../../../.storybook/mocks/assets/avatar/avatar-assets.js";
import avatarAssets2 from "../../../.storybook/mocks/assets/avatar/avatar-assets-2.js";

export default {
  title: "Game UI/Avatar",
};

GameService.mock({
  getEntityStream: () => Rx.Observable.empty(),
});

export const sizes = () => ({
  data: () => ({
    avatarAssets,
  }),
  template: `
<div>
  <HorizontalWrap>
    <Vertical>
      <Avatar :avatarAssets="avatarAssets" size="tiny" />
      <Avatar :avatarAssets="avatarAssets" size="tiny" headOnly />
    </Vertical>
    <Vertical>
      <Avatar :avatarAssets="avatarAssets" size="small" />
      <Avatar :avatarAssets="avatarAssets" size="small" headOnly />
    </Vertical>
    <Vertical>
      <Avatar :avatarAssets="avatarAssets" size="normal" />
      <Avatar :avatarAssets="avatarAssets" size="normal" headOnly />
    </Vertical>
    <Vertical>
      <Avatar :avatarAssets="avatarAssets" size="large" />
      <Avatar :avatarAssets="avatarAssets" size="large" headOnly />
    </Vertical>
    <Vertical>
      <Avatar :avatarAssets="avatarAssets" size="huge" />
      <Avatar :avatarAssets="avatarAssets" size="huge" headOnly />
    </Vertical>
  </HorizontalWrap>
</div>`,
});

export const emos = () => ({
  data: () => ({
    avatarAssets,
  }),
  template: `
<div>
  <HorizontalWrap>
    <Avatar :avatarAssets="avatarAssets" size="large" headOnly emo=":)" />
    <Avatar :avatarAssets="avatarAssets" size="large" headOnly emo=":D" />
    <Avatar :avatarAssets="avatarAssets" size="large" headOnly emo=":(" />
    <Avatar :avatarAssets="avatarAssets" size="large" headOnly emo=":<" />
    <Avatar :avatarAssets="avatarAssets" size="large" headOnly emo=":/" />
    <Avatar :avatarAssets="avatarAssets" size="large" headOnly emo=":O" />
    <Avatar :avatarAssets="avatarAssets" size="large" headOnly emo=":P" />
  </HorizontalWrap>
</div>`,
});

export const framing = () => ({
  data: () => ({
    avatarAssets,
  }),
  template: `
<div>
  <HorizontalWrap>
    <Avatar :avatarAssets="avatarAssets" size="large" />
    <Avatar :avatarAssets="avatarAssets" size="large" noFrame />
    <Avatar :avatarAssets="avatarAssets" size="large" headOnly />
  </HorizontalWrap>
</div>`,
});

export const faces = () => ({
  data: () => ({
    avatarAssets,
  }),
  template: `
<div>
  <HorizontalWrap>
    <Avatar :creature="{ dead: true }" :avatarAssets="avatarAssets" size="large" />
    <Avatar :creature="{ effects: [{name:'Extreme pain'}] }" :avatarAssets="avatarAssets" size="large" />
    <Avatar :creature="{ effects: [{name:'Major pain'}] }" :avatarAssets="avatarAssets" size="large" />
    <Avatar :creature="{ effects: [{name:'Exhausted'}] }" :avatarAssets="avatarAssets" size="large" />
    <Avatar :creature="{ effects: [{name:'Slightly Sad'}] }" :avatarAssets="avatarAssets" size="large" />
    <Avatar :creature="{ effects: [{name:'Sad'}] }" :avatarAssets="avatarAssets" size="large" />
    <Avatar :creature="{ effects: [{name:'Very Sad'}] }" :avatarAssets="avatarAssets" size="large" />
    <Avatar :creature="{ effects: [{name:'Gloomy'}] }" :avatarAssets="avatarAssets" size="large" />
    <Avatar :creature="{ currentAction: { actionId: 'Sleep'}}" :avatarAssets="avatarAssets" size="large" />
  </HorizontalWrap>
</div>`,
});

export const variants = () => ({
  data: () => ({
    avatarAssets2,
  }),
  template: `
<div>
  <HorizontalWrap>
    <Avatar :creature="{ dead: true }" :avatarAssets="avatarAssets2" size="large" />
    <Avatar :creature="{ effects: [{name:'Extreme pain'}] }" :avatarAssets="avatarAssets2" size="large" />
    <Avatar :creature="{ effects: [{name:'Major pain'}] }" :avatarAssets="avatarAssets2" size="large" />
    <Avatar :creature="{ effects: [{name:'Exhausted'}] }" :avatarAssets="avatarAssets2" size="large" />
    <Avatar :creature="{ effects: [{name:'Slightly Sad'}] }" :avatarAssets="avatarAssets2" size="large" />
    <Avatar :creature="{ effects: [{name:'Sad'}] }" :avatarAssets="avatarAssets2" size="large" />
    <Avatar :creature="{ effects: [{name:'Very Sad'}] }" :avatarAssets="avatarAssets2" size="large" />
    <Avatar :creature="{ effects: [{name:'Gloomy'}] }" :avatarAssets="avatarAssets2" size="large" />
    <Avatar :creature="{ currentAction: { actionId: 'Sleep'}}" :avatarAssets="avatarAssets2" size="large" />
  </HorizontalWrap>
</div>`,
});
