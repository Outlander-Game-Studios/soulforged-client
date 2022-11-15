import "./ResourceIcon.vue";
import pebbleIcon from "../../../.storybook/mocks/assets/pebble.png";

export default {
  title: "Game UI/ResourceIcon",
};

const factory = (onMounted, onCreate) => {
  return mockComponent(
    {
      data: () => ({
        icon: pebbleIcon,
      }),

      template: `
        <div>
        <Horizontal tight>
          <ResourceIcon :size="3" :resource="{icon: icon, density: 9000 }"/>
          <ResourceIcon :size="3" :resource="{icon: icon, density: 4 }"/>
          <ResourceIcon :size="3" :resource="{icon: icon, density: 3 }"/>
          <ResourceIcon :size="3" :resource="{icon: icon, density: 2 }"/>
          <ResourceIcon :size="3" :resource="{icon: icon, density: 1 }"/>
        </Horizontal>
        <Horizontal tight>
          <ResourceIcon :resource="{icon: icon, density: 9000 }"/>
          <ResourceIcon :resource="{icon: icon, density: 4 }"/>
          <ResourceIcon :resource="{icon: icon, density: 3 }"/>
          <ResourceIcon :resource="{icon: icon, density: 2 }"/>
          <ResourceIcon :resource="{icon: icon, density: 1 }"/>
        </Horizontal>
        <Horizontal tight>
          <ResourceIcon :size="9" :resource="{icon: icon, density: 9000 }"/>
          <ResourceIcon :size="9" :resource="{icon: icon, density: 4 }"/>
          <ResourceIcon :size="9" :resource="{icon: icon, density: 3 }"/>
          <ResourceIcon :size="9" :resource="{icon: icon, density: 2 }"/>
          <ResourceIcon :size="9" :resource="{icon: icon, density: 1 }"/>
        </Horizontal>
        </div>
        <script>
        import Horizontal from "./Horizontal";
        export default {
          components: {Horizontal}
        }
        </script>`,
    },
    onMounted,
    onCreate
  );
};

export const base = factory();
