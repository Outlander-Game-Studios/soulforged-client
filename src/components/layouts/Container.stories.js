export default {
  title: "Base UI/Containers",
};

const text = Array.apply(null, Array(20))
  .map(() => loremIpsum)
  .join("");

export const base = () => ({
  template: `
<Container>
  <Spaced>
    ${text}
  </Spaced>
</Container>
`,
});

export const baseWide = () => ({
  template: `
<Container :borderSize="1.5">
  <Spaced>
    ${text}
  </Spaced>
</Container>
`,
});

export const baseAlt = () => ({
  template: `
<Container backgroundType="alt">
  <Spaced>
    ${text}
  </Spaced>
</Container>
`,
});

export const alt = () => ({
  template: `
<Container borderType="alt" :borderSize="1.5">
  <Spaced>
    ${text}
  </Spaced>
</Container>
`,
});

export const alt2 = () => ({
  template: `
<Container borderType="alt2" :borderSize="1.5">
  <Spaced>
    ${text}
  </Spaced>
</Container>
`,
});

export const alt3 = () => ({
  template: `
<Container borderType="alt3" backgroundType="alt3" :borderSize="1.5">
  <Spaced>
    ${text}
  </Spaced>
</Container>
`,
});

export const combined = () => ({
  template: `
<Container borderType="alt" backgroundType="base" :borderSize="1.5">
  <Spaced>
    <Container borderType="alt3" backgroundType="alt3" :borderSize="1.5">
      <Spaced>
        ${text}
      </Spaced>
    </Container>
  </Spaced>
</Container>
`,
});

export const combined2 = () => ({
  template: `
<Container borderType="base" backgroundType="alt" :borderSize="1.5">
  <Spaced>
    <Container borderType="alt3" backgroundType="alt3" :borderSize="1.5">
      <Spaced>
        ${text}
      </Spaced>
    </Container>
  </Spaced>
</Container>
`,
});
