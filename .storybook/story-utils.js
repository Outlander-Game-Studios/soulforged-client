import inventoryIcon from "../src/assets/ui/cartoon/icons/tabs/items.png";

/* istanbul ignore file */
export const clickAndRespond = (vm, response) => {
  window.GameService.request = () => Promise.resolve(response);
  vm.$el.querySelector(".main button").click();
};

export const operationWrapper = (template, fullscreen) => `
<Vertical>
  <div :style="{ display: 'flex' }"  v-if="!${fullscreen}">
    <div class="tab-icon inventory">
      <Icon src="${inventoryIcon}" :size="3.5" />
    </div>
    <div :style="{ flexGrow: 1 }">
      <APBarCurrent />
    </div>
  </div>
      ${
        fullscreen
          ? template
          : `
  <div :style="{ position: 'relative', margin: '1.5rem', display: 'flex' }">
    <div :style="{ position: 'relative' }">
      <Container
        borderType="alt"
        :borderSize="1.5"
        :style="{
          maxHeight: 'calc(var(--app-height) - 10rem) !important',
          maxWidth: 'calc(var(--app-width) - 3rem) !important'
        }"
      >
        <Spaced>
          ${template}
        </Spaced>
      </Container>
    </div>
  </div>
`
      }

  <ToastNotifications />
</Vertical>
`;
