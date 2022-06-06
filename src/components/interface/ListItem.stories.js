import sampleIcon from "../../../.storybook/mocks/assets/mood_up.png";

export default {
  title: "Base UI/Lists",
};

const item = `
<ListItem iconSrc="${sampleIcon}">
  <template v-slot:title>
    Item name
  </template>
  <template v-slot:subtitle>
    More descriptive stuff
  </template>
  <template v-slot:buttons>
    <Button>Pick up</Button>
  </template>
</ListItem>
`;

export const sample = () => ({
  template: `
<Container>
  <Spaced>
    <Vertical>
      ${item}
      ${item}
      ${item}
      ${item}
      <ListItem iconSrc="${sampleIcon}">
        <template v-slot:title>
          Very very very very very very very very very very very very long item name
        </template>
        <template v-slot:subtitle>
            Very very very very very very very very very very very very very long description
        </template>
        <template v-slot:buttons>
            <Button>Pick up</Button>
        </template>
      </ListItem>
    </Vertical>
  </Spaced>
</Container>
`,
});
