export default {
  title: "Base UI/Buttons",
};

export const styles = () => ({
  methods: {
    onClick() {
      alert("button clicked");
    },
  },
  template: `
<div>
  <Spaced>
    <Button @click="onClick" >Standard</Button>
    <Button @click="onClick"  class="active">Pressed</Button>
  </Spaced>
  <Spaced>
    <Button @click="onClick" type="accept">Accept</Button>
    <Button @click="onClick" type="accept" class="active">Pressed</Button>
  </Spaced>
  <Spaced>
    <Button @click="onClick" type="reject">Reject</Button>
    <Button @click="onClick" type="reject" class="active">Pressed</Button>
  </Spaced>
  <Spaced>
    <Button @click="onClick" disabled>Disabled</Button>
    <Button @click="onClick" disabled class="active">Pressed</Button>
  </Spaced>
  <Spaced>
    <Button @click="onClick" disabled type="accept">Accept</Button>
    <Button @click="onClick" disabled type="accept" class="active">Pressed</Button>
  </Spaced>
  <Spaced>
    <Button @click="onClick" disabled type="reject">Reject</Button>
    <Button @click="onClick" disabled type="reject" class="active">Pressed</Button>
  </Spaced>
</div>`,
});

export const processing = () => ({
  data: () => ({
    processing: new Promise(() => {}),
    processed: Promise.resolve(),
    dynamic: null,
  }),
  methods: {
    trigger() {
      this.dynamic = new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    },
  },
  template: `
<Vertical>
  <Button :processing="processing">Processing</Button>
  <Button :processing="processed">Processed</Button>
  <Button :processing="dynamic" @click="trigger">1 sec process</Button>
</Vertical>
`,
});

export const layouts = () => ({
  template: `
<div>
  <Spaced>
    <Vertical>
      <Button>Vertical 1</Button>
      <Button>Vertical 2</Button>
      <Button>Vertical 3</Button>
    </Vertical>
  </Spaced>
  <Spaced>
    <Horizontal>
      <Button>Horizontal 1</Button>
      <Button>Horizontal 2</Button>
      <Button>Horizontal 3</Button>
    </Horizontal>
  </Spaced>
  <Spaced>
    <HorizontalFill>
      <Button>H Fill 1</Button>
      <Button>H Fill 2</Button>
      <Button>H Fill 3</Button>
    </HorizontalFill>
  </Spaced>
  <Spaced>
    <HorizontalWrap>
      <Button>Horizontal Wrap 1</Button>
      <Button>Horizontal Wrap 2</Button>
      <Button>Horizontal Wrap 3</Button>
      <Button>Horizontal Wrap 4</Button>
      <Button>Horizontal Wrap 5</Button>
      <Button>Horizontal Wrap 6</Button>
      <Button>Horizontal Wrap 7</Button>
    </HorizontalWrap>
  </Spaced>
</div>
`,
});
