export default {
  title: 'Base UI/Inputs',
}

const factory =
  ({ min, value = null, type, disabled } = {}) =>
  () => ({
    data: () => ({
      value,
      type,
      disabled,
      min,
    }),
    template: `
<div>
  <Input v-model:value="value" :type="type" :disabled="disabled" :min="min" :max="100 " />
  <div>Value: {{ value }}</div>
</div>
`,
  })

export const text = factory()
export const textDisabled = factory({
  value: 'initial value',
  disabled: true,
})
export const textWithValue = factory({
  value: 'initial value',
})
export const number = factory({ type: 'number' })
export const numberDisabled = factory({
  type: 'number',
  value: 5,
  disabled: true,
})
export const numberWithValue = factory({ type: 'number', value: 2 })
export const numberWithMin = factory({ min: 1, type: 'number' })

export const noChoice = () => ({
  data: () => ({ value: 1 }),
  template: `
  <div>
    <Input v-model:value="value" type="number" :min="1" :max="1" />
    <div>Value: {{ value }}</div>
  </div>
`,
})
