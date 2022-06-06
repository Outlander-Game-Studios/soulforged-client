export default {
  title: "Base UI/Tabs",
};

const factory = (placement = "top") => () => {
  return {
    data: () => ({
      placement,
      loremIpsum,
    }),
    template: `
      <div>
      <Tabs :url="false" :placement="placement">
        <Tab header="First">
          <Spaced>
            First tab content
          </Spaced>
        </Tab>
        <Tab header="Second">
          <Spaced>
            Second tab content
          </Spaced>
        </Tab>
        <Tab header="Third" :indicator="5">
          <Spaced>
            This tab content - has indicator
          </Spaced>
        </Tab>
        <Tab header="Fourth">
          <Spaced>
            Very long content:
            {{ loremIpsum }}
            {{ loremIpsum }}
            {{ loremIpsum }}
            {{ loremIpsum }}
            {{ loremIpsum }}
            {{ loremIpsum }}
            {{ loremIpsum }}
          </Spaced>
        </Tab>
        <Tab header="Fifth">
          <Spaced>
            Very long content:
            {{ loremIpsum }}
            {{ loremIpsum }}
            {{ loremIpsum }}
            {{ loremIpsum }}
            {{ loremIpsum }}
            {{ loremIpsum }}
            {{ loremIpsum }}
          </Spaced>
        </Tab>
      </Tabs>
      </div>
    `,
  };
};

export const PlacementTop = factory("top");
export const PlacementLeft = factory("left");
export const PlacementRight = factory("right");
export const PlacementBottom = factory("bottom");

export const withHtml = () => {
  return {
    data: () => ({
      loremIpsum,
    }),
    template: `
      <div>
      <Tabs :url="false">
        <template v-slot:header:First> <b>First</b> </template>
        <template v-slot:header:Second> <em>Second</em> </template>
        <template v-slot:header:Third> <b>Th<em>i</em>rd</b> </template>
        <Tab header="First">
          <Spaced>
            First tab content
          </Spaced>
        </Tab>
        <Tab header="Second">
          <Spaced>
            Second tab content
          </Spaced>
        </Tab>
        <Tab header="Third" :indicator="5">
          <Spaced>
            This tab content - has indicator
          </Spaced>
        </Tab>
      </Tabs>
      </div>
    `,
  };
};
