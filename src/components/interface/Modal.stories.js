export default {
  title: "Base UI/Modal",
};

export const simple = () => ({
  template: `
<Modal >
  ${loremIpsum}
</Modal>
`,
});

export const closeable = () => ({
  methods: {
    alert() {
      alert("That'd close it");
    },
  },

  template: `
<Modal @close="alert" >
  ${loremIpsum}
</Modal>
`,
});

export const withLongContents = () => ({
  template: `
<Modal>
  ${loremIpsum}${loremIpsum}${loremIpsum}${loremIpsum}${loremIpsum}${loremIpsum}
</Modal>
`,
});

export const withTitle = () => ({
  template: `
<Modal >
  <template v-slot:title>
    Some <b>title</b>
  </template>
  <template v-slot:contents>
    ${loremIpsum}
  </template>
</Modal>
`,
});

export const withLongTitle = () => ({
  template: `
<Modal >
  <template v-slot:title>
    This is a very long title This is a very long title This is a very long title
  </template>
  <template v-slot:contents>
    ${loremIpsum}
  </template>
</Modal>
`,
});

const dialogTinyTemplate = (text) => () => ({
  template: `
<Modal dialog>
  <Vertical>
    <div>${text}</div>
    <HorizontalCenter>
      <Button>Yes</Button>
      <Button>No</Button>
    </HorizontalCenter>
  </Vertical>
</Modal>
`,
});

const dialogLargeTemplate = (text) => () => ({
  template: `
<Modal dialog large>
  <Vertical>
    <div>${text}</div>
    <HorizontalCenter>
      <Button>Yes</Button>
      <Button>No</Button>
    </HorizontalCenter>
  </Vertical>
</Modal>
`,
});

export const dialogVeryShort = dialogTinyTemplate("Are you sure?");
export const dialogShort = dialogTinyTemplate(
  "Are you really, really super sure?"
);
export const dialogLong = dialogTinyTemplate(
  "Are you so sure that there's no chance that you might not be entirely and totally sure?"
);

export const dialogLarge = dialogLargeTemplate("Are you sure?");

const modalAppearingTemplate = (dialog) => () => ({
  data: () => ({
    show: false,
    dialog,
  }),

  created() {
    setInterval(() => {
      this.show = !this.show;
    }, 1000);
  },

  template: `
<div>
  <Modal :dialog="dialog" v-if="show">
    <Vertical>
      <div>${dialog ? "Are you really, really super sure?" : loremIpsum}</div>
      <HorizontalCenter>
        <Button>Yes</Button>
        <Button>No</Button>
      </HorizontalCenter>
    </Vertical>
  </Modal>
</div>
`,
});
export const modalAppearing = modalAppearingTemplate(false);
modalAppearing.parameters = {
  storyshots: { disable: true },
};
export const dialogAppearing = modalAppearingTemplate(true);
dialogAppearing.parameters = {
  storyshots: { disable: true },
};

export const zIndexCheck = () => ({
  template: `
<div>
  <div :style="{ 'z-index': 3, position: 'absolute' }">
    <Container>
      Container
    </Container>
  </div>
  <div :style="{ 'z-index': 2, position: 'absolute' }">
    <Modal @close="() => {}">
      ${loremIpsum}
    </Modal>
  </div>
</div>
`,
});
