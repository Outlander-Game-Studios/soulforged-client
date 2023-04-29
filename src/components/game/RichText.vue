<template>
  <span>
    <template v-for="part in parts"
      ><span v-if="part.type === TYPES.TEXT && !html">{{ part.text }}</span
      ><span v-if="part.type === TYPES.TEXT && html" v-html="part.text"></span
      ><span
        v-else-if="part.type === TYPES.NAME"
        :class="{
          nameable: !!part.code,
          named: !!nameOverrides[part.code] || !!part.named,
          nonInteractive: nonInteractive,
        }"
        :data-code="part.code"
        @click="startNaming(part, $event)"
        >{{ displayName(part) }}</span
      ><span v-else-if="part.type === TYPES.EFFECT">
        <div v-if="part.options.fullView" class="full-view-effect">
          <Effects :effects="[getEffectInfo(part)]" />
        </div>
        <span v-else class="effect-part" @click="showInfo(part, $event)">
          <Icon
            :src="part.icon"
            :size="2"
            backgroundType="severity-0"
            :text="{ bottomRight: getStacks(part) }"
          /><RichText nonInteractive :value="part.name" />
        </span> </span
    ></template>
    <Modal v-if="effectInfo" dialog @close="effectInfo = null">
      <template v-slot:title> Effect </template>
      <template v-slot:contents>
        <div class="effect-modal">
          <div>
            <Effects :effects="[effectInfo]" />
          </div>
        </div>
      </template>
    </Modal>
    <Modal v-if="isNaming" dialog @close="isNaming = null">
      <template v-slot:title> Update name </template>
      <template v-slot:contents>
        <div class="naming-modal">
          <LoadingPlaceholder v-if="!namingInfo" />
          <Vertical v-else>
            <div>
              <Icon
                v-if="namingInfo.icon"
                class="icon"
                :src="namingInfo.icon"
              />
              <Input
                v-model="selectedName"
                @enter="$refs.submit.click()"
                autoFocus
              />
              <div class="error-text">{{ error }}</div>
              <HorizontalCenter>
                <Button
                  :processing="processing"
                  @click="saveName()"
                  ref="submit"
                  :disabled="!selectedName"
                >
                  Confirm
                </Button>
              </HorizontalCenter>
              <Description v-if="namingInfo.description" class="description">
                <RichText :value="namingInfo.description" />
              </Description>
            </div>
            <Spaced>
              <Header>
                Names by other players
                <Help title="Other names">
                  List of names that other players chose to assign. Numbers next
                  to the names indicate how many players opted to use each
                  name.<br />
                  <br />
                  You can click any of the names listed there to use that name
                  yourself.
                </Help>
              </Header>
              <div class="empty-text" v-if="!namingInfo.otherNames.length">
                None
              </div>
              <Spaced>
                <Header
                  v-for="otherName in namingInfo.otherNames"
                  :key="otherName.name"
                  alt2
                  class="interactive"
                  @click="useExisting(otherName.name)"
                >
                  {{ otherName.name }}: {{ otherName.count }}
                </Header>
              </Spaced>
            </Spaced>
            <Description></Description>
          </Vertical>
        </div>
      </template>
    </Modal>
  </span>
</template>

<script>
import exclamationIcon from "../../assets/ui/cartoon/icons/exclamation.png";
import namingOpenSound from "../../assets/sounds/naming-open.ogg";
import namingCloseSound from "../../assets/sounds/naming-close.ogg";
import Effects from "./Effects";
import ListItem from "../interface/ListItem";
import Vertical from "../layouts/Vertical";

const TYPES = {
  TEXT: 1,
  NAME: 2,
  EFFECT: 3,
};

export default {
  components: { Vertical, ListItem, Effects },
  props: {
    value: {},
    html: {
      type: Boolean,
    },
    nonInteractive: {
      type: Boolean,
    },
  },

  data: () => ({
    TYPES,
    isNaming: null,
    selectedName: "",
    namingInfo: null,
    processing: null,
    effectInfo: null,
  }),

  subscriptions() {
    return {
      nameOverrides: GameService.getNameOverrideStream(),
    };
  },

  computed: {
    parts() {
      if (!this.value) {
        return [];
      }
      function divvyUp(value, open, close, callback) {
        return `${value}`.split(close).reduce((acc, part) => {
          const [first, second = ""] = part.split(open);
          const results = callback(first, second);
          return [...acc, ...results];
        }, []);
      }

      return divvyUp(this.value, "〚", "〛", (first, second) => {
        const result = divvyUp(first, "{", "}", (first, second) => {
          const result = [];
          result.push({
            type: TYPES.TEXT,
            text: first,
          });
          if (second) {
            const [code, named, current] = second.split(":");
            result.push({
              type: TYPES.NAME,
              code,
              named: +named,
              text: current,
            });
          }
          return result;
        });
        if (second) {
          const [name, icon, effectPayload, options] = second.split("﹃");
          result.push({
            type: TYPES.EFFECT,
            name,
            icon,
            effectPayload,
            options: JSON.parse(options),
          });
        }
        return result;
      });
    },
    error() {
      const failedCheck = NAMING_RULES.find(
        ({ regex }) => !regex.test(this.selectedName)
      );
      if (failedCheck) {
        return failedCheck.message;
      }
    },
  },

  methods: {
    getStacks(part) {
      if (part.effectPayload) {
        const parsed = JSON.parse(part.effectPayload);
        if (parsed.stacks !== undefined) {
          return parsed.stacks;
        }
      }
      return "";
    },

    displayName(part) {
      if (part.code && this.nameOverrides[part.code]) {
        return this.nameOverrides[part.code];
      }
      return part.text;
    },

    getEffectInfo(part) {
      return {
        ...part,
        ...JSON.parse(part.effectPayload),
      };
    },
    showInfo(part, $event) {
      this.effectInfo = this.getEffectInfo(part);
    },

    startNaming(part, $event) {
      if (!part.code || this.nonInteractive) {
        return;
      }
      $event.stopPropagation();
      this.isNaming = part;
      SoundService.playSound(namingOpenSound);
      this.selectedName =
        this.nameOverrides[part.code] || (part.named ? part.text : "");
      GameService.request(REQUEST_CODES.GET_NAMEABLE, {
        nameId: part.code,
      }).then((result) => {
        this.namingInfo = {
          icon: result.icon,
          description: result.description,
          otherNames: Object.keys(result.otherNames)
            .map((name) => ({
              name: name,
              count: result.otherNames[name],
            }))
            .sort((a, b) => {
              return b.count - a.count;
            }),
        };
      });
    },

    useExisting(name) {
      this.selectedName = name;
      this.saveName();
    },

    saveName() {
      const code = this.isNaming.code;
      const selectedName = this.selectedName;
      this.processing = GameService.request(REQUEST_CODES.SET_NAMEABLE, {
        nameId: code,
        name: selectedName,
      }).then((result) => {
        if (result.ok) {
          this.isNaming = null;
          SoundService.playSound(namingCloseSound);
          GameService.setNameOverride(code, selectedName);
        } else {
          ToastNotify({
            icon: exclamationIcon,
            text: "Invalid name",
            subtext: result.message || "Unexpected error",
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

@keyframes underline-shine {
  0% {
    text-decoration-color: inherit;
  }
  20% {
    text-decoration-color: #c38663;
  }
  40% {
    text-decoration-color: inherit;
  }
  100% {
    text-decoration-color: inherit;
  }
}

.nameable {
  $offset: 0.1rem;
  text-decoration: underline;
  text-underline-offset: $offset + 0.1rem;
  text-decoration-thickness: 0.06em;

  &:not(.named) {
    text-decoration-style: solid;
    text-underline-offset: $offset;
    text-decoration-thickness: 0.075em;
    &:not(.nonInteractive) {
      animation: underline-shine 1s linear infinite;
    }
  }

  @include FirefoxOnly() {
    $offset-ff: 0.2rem;
    text-underline-offset: $offset-ff + 0.05rem !important;

    &:not(.named) {
      text-underline-offset: $offset-ff !important;
    }
  }

  &.named {
    text-decoration-style: dotted;
  }

  &:not(.nonInteractive):hover {
    text-decoration-style: dashed;
    cursor: pointer;
  }
}

.naming-modal,
.effect-modal {
  .icon {
    float: right;
    margin-left: 1rem;
  }
  .description {
    margin-top: 1rem;
  }
}
.effect-part {
  cursor: pointer;
  display: inline-flex;
  vertical-align: middle;
  text-decoration: underline dashed;
  text-underline-offset: 0.1rem;
  text-decoration-thickness: 0.06em;
  margin-left: 0.25rem;

  > .icon-wrapper {
    margin-right: 0.3em;
  }
}

.full-view-effect {
  display: inline-block;
  text-align: left;
}
</style>
