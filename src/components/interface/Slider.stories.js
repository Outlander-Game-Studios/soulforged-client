export default {
  title: 'Base UI/Slider',
}

export const base = () => ({
  data: () => ({ value: 0 }),
  template: `
<Slider v-model:value="value" />
`,
})

export const withValue = () => ({
  data: () => ({ value: 33 }),
  template: `
<Slider v-model:value="value" />
`,
})

export const steps = () => ({
  data: () => ({ value: 0 }),
  template: `
<Slider v-model:value="value" :step="25" />
`,
})

export const disabled = () => ({
  data: () => ({ value: 33 }),
  template: `
<Slider v-model:value="value" disabled />
`,
})
