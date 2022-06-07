<template>
  <div class="dialogue-operation">
    <CloseButton class="close-button" @click="cancel()" />
    <Horizontal>
      <div class="flex-grow">
        <Header>Chat</Header>
      </div>
      <Button
        v-if="operation.context.openQuestions"
        noPadding
        @click="openQuestion = true"
      >
        <span class="header-button">More...</span>
      </Button>
    </Horizontal>
    <div class="entries" ref="entries">
      <div
        v-for="(entry, idx) in operation.context.history"
        :key="entry.who + '_' + idx"
        class="entry"
        :class="{ own: isOwnEntry(entry) }"
        :ref="'message_' + entry.when"
      >
        <CreatureIcon
          :creatureId="entry.who"
          noSleep
          class="entry-avatar"
          size="tiny"
        />
        <div>
          <div class="title">
            <span class="name">
              <CreatureName :creatureId="entry.who" />
            </span>
          </div>
          <span class="entry-text">
            <LanguageIncluded :value="entry.text" />
          </span>
        </div>
      </div>
    </div>
    <Vertical class="responses">
      <Container
        v-for="(text, id) in operation.context.options"
        :key="id"
        @click="commence(id)"
        class="response"
        :borderSize="0.3"
      >
        <LanguageIncluded :value="text" />
      </Container>
    </Vertical>
    <div>
      <Modal v-if="openQuestion" @close="openQuestion = false">
        <template v-slot:title>
          Ask Me Anything...
          <AskMeAnythingHelp />
        </template>
        <template v-slot:contents>
          <OpenQuestionPanel
            :operation="operation"
            @close="openQuestion = false"
          />
        </template>
      </Modal>
    </div>
  </div>
</template>

<script>
export default window.OperationDialogue = {
  props: {
    operation: {},
  },

  data: () => ({
    openQuestion: false,
    MAX_PENDING_OPEN_QUESTIONS,
  }),

  subscriptions() {
    return {
      mainEntity: GameService.getRootEntityStream(),
      scroll: this.$stream("operation")
        .switchMap((operation) => Rx.Observable.of(operation.context.history))
        .distinctUntilChanged(null, JSON.stringify)
        .tap(() => {
          this.scrollToNewest();
        }),
    };
  },

  methods: {
    scrollToNewest() {
      const interval = setInterval(() => {
        const el = this.$refs.entries;
        if (el) {
          el.scrollTo(0, el.scrollHeight, {
            behavior: "smooth",
          });
          clearInterval(interval);
        }
      }, 50);
    },

    commence(option) {
      SoundService.playSound(SoundService.SOUNDS.BUTTON);
      GameService.request(REQUEST_CODES.COMMENCE_OPERATION, {
        option,
      }).then(() => {});
    },

    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION);
    },

    isOwnEntry(entry) {
      return entry.who === this.mainEntity.id;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../utils.scss";

.dialogue-operation {
  min-width: 30rem;
  display: flex;
  flex-direction: column;

  @media (orientation: landscape) {
    width: 50rem;
    height: min(var(--app-height) - 16rem, 45rem);
  }
  @media (orientation: portrait) {
    width: calc(0.85 * var(--app-width));
    height: min(var(--app-height) - 30rem, 45rem);
  }

  > * {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.entries {
  min-height: 10rem;
  height: 0;
  flex-grow: 1;
  overflow: auto;
  padding-right: 0.5rem;
  @include filter-fix();
}

.entry {
  display: flex;
  position: relative;
  padding-bottom: 2rem;

  .title {
    font-size: 66%;
    display: flex;

    .name {
      font-style: italic;
    }
  }

  .entry-text {
    font-size: 80%;
  }

  &:not(.own) {
    flex-direction: row;
    text-align: left;

    .entry-avatar {
      margin-right: 1rem;
    }
  }
  &.own {
    flex-direction: row-reverse;
    text-align: right;

    .title {
      flex-direction: row-reverse;
    }

    .entry-avatar {
      margin-left: 1rem;
    }
  }
}

.responses {
  min-height: 13rem;
}
.response {
  cursor: pointer;
  padding: 0.45rem;
  font-size: 80%;
  background: #e1bc98;

  &:hover {
    background: #edcfb3;
  }
}
</style>
