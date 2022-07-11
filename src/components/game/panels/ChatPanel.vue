<template>
  <div class="chat-panel">
    <Header>Local chat</Header>
    <div class="chat-messages-wrapper" ref="chatMessagesWrapper">
      <div class="filler" />
      <LoadingPlaceholder v-if="!messages" />
      <div v-else-if="!messages.length" class="empty-text">No messages</div>
      <div
        v-for="message in messages"
        class="message interactive"
        :class="{ own: isOwnMessage(message) }"
        :ref="'message_' + message.when"
        @click="viewMessage = message"
        v-observe-visibility="onMessageVisibilityChange(message)"
      >
        <div
          v-if="firstUnreadMessage && message.when === firstUnreadMessage.when"
          class="unread-marker"
          ref="unreadMarker"
        >
          <span class="left"></span>
          <span class="left-connector"></span>
          <span class="text">New messages</span>
          <span class="right-connector"></span>
          <span class="right"></span>
        </div>
        <div class="avatar-container">
          <OnlyIfVisible>
            <Avatar
              class="message-avatar"
              :class="{ absent: !characterPresent(message) }"
              headOnly
              size="tiny"
              :emo="message.emo"
              :chatHead="message.whoId"
            />
          </OnlyIfVisible>
        </div>
        <div class="flex-grow">
          <div class="title">
            <OnlyIfVisible>
              <div class="title-contents">
                <span class="name">{{ getCharacterName(message) }}</span>
                <span class="date">{{ message.formattedTime }}</span>
              </div>
            </OnlyIfVisible>
          </div>
          <span class="message-text" v-if="message.msg">{{ message.msg }}</span>
          <span class="message-text redacted" v-else>Message redacted</span>
        </div>
      </div>
    </div>
    <div v-if="emoSelector">
      <Header>Select Mood</Header>
      <HorizontalWrap tight>
        <div class="emo-selector" v-for="emo in EMOS" :key="emo">
          <Avatar
            headOnly
            :creature="myCreature"
            size="small"
            :emo="emo"
            @click="selectEmo(emo)"
          />
          <span class="emo-text">{{ emo }}</span>
        </div>
      </HorizontalWrap>
    </div>
    <div class="chat-input">
      <div>
        <Avatar
          headOnly
          :creature="myCreature"
          size="tiny"
          :emo="currentEmo"
          @click="emoSelector = !emoSelector"
        />
      </div>
      <Input
        ref="textInput"
        v-model="newMessageText"
        class="message-input"
        :disabled="sending"
        @keypress="inputKeypress($event)"
        noSelectOnFocus
      />
      <Button @click="sendMessage()" :disabled="sending" class="send-button">
        Send
      </Button>
    </div>
    <transition name="fade">
      <div
        v-if="errorMsg"
        class="message-error interactive"
        @click="errorMsg = null"
      >
        {{ errorMsg }}
      </div>
    </transition>
    <Modal v-if="viewMessage" dialog large @close="viewMessage = null">
      <template v-slot:title> Message </template>
      <template v-slot:contents>
        <Vertical>
          <div class="message" :class="{ own: isOwnMessage(viewMessage) }">
            <Avatar
              class="message-avatar"
              :class="{ absent: !characterPresent(viewMessage) }"
              headOnly
              size="tiny"
              :emo="viewMessage.emo"
              :chatHead="viewMessage.whoId"
            />
            <div class="flex-grow">
              <div class="title">
                <span class="name">{{ getCharacterName(viewMessage) }}</span>
                <span class="date">{{ viewMessage.formattedTime }}</span>
              </div>
              <span class="message-text" v-if="viewMessage.msg">{{
                viewMessage.msg
              }}</span>
              <span class="message-text redacted" v-else>Message redacted</span>
            </div>
          </div>
          <HorizontalCenter>
            <Description v-if="!characterPresent(viewMessage)">
              Faded character picture indicates they are currently in another
              location.
            </Description>
          </HorizontalCenter>
          <HorizontalCenter>
            <Actions :target="messageAuthor" @action="onAction()"></Actions>
            <ReportButton
              v-if="viewMessage.msg"
              large
              class="report-message"
              title="Report message"
              :description="
                'Report message sent by <em>' +
                getCharacterName(viewMessage) +
                '</em> as inappropriate:<br><em>' +
                viewMessage.msg +
                '</em>'
              "
              type="chat"
              :refId="{ whoId: viewMessage.whoId, timestamp: viewMessage.when }"
            />
          </HorizontalCenter>
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
const EMOS = [":)", ":D", ":(", ":<", ":/", ":O", ":P"];

export default {
  data: () => ({
    errorMsg: null,
    newMessageText: "",
    sending: false,
    emoSelector: false,
    viewMessage: null,
    currentEmo: EMOS.first(),
    EMOS,
  }),

  watch: {
    errorMsg(value) {
      if (value) {
        clearTimeout(this.clearErrorTimeout);
      }
    },
    newMessageText(value) {
      value = value || "";
      LocalStorageService.setItem("typedChatMessage", value);
      const error = ChatMessageValidator(value);
      if (error && value) {
        this.errorMsg = error;
      } else {
        this.errorMsg = null;
      }
    },
  },

  subscriptions() {
    const messagesStream = ChatService.getMessagesStream();
    const lastReadTimestampStream = ChatService.getLastReadTimestampStream();
    const creaturesStream = messagesStream
      .filter((messages) => !!messages)
      .map((messages) =>
        messages.reduce((acc, msg) => ({ ...acc, [msg.whoId]: true }), {})
      )
      .map((creaturesMap) => Object.keys(creaturesMap))
      .switchMap((creaturesIds) =>
        GameService.getEntitiesStream(creaturesIds, ENTITY_VARIANTS.CHAT_HEAD)
      );
    const firstUnreadMessageStream = Rx.combineLatest(
      messagesStream,
      lastReadTimestampStream.first()
    )
      .first()
      .map(([messages, lastReadTimestampStream]) => {
        const firstUnreadMessage = messages.find(
          (message) => message.when > lastReadTimestampStream
        );
        setTimeout(() => {
          if (firstUnreadMessage) {
            if (this.$refs.unreadMarker?.length) {
              this.$refs.unreadMarker.first().scrollIntoView();
            }
          } else {
            this.scrollToNewest();
          }
        });
        return firstUnreadMessage;
      });

    return {
      messages: messagesStream.tap(() => {
        this.maintainBottomScroll();
      }),
      firstUnreadMessage: firstUnreadMessageStream,
      myCreature: GameService.getMyCreatureStream(),
      characters: creaturesStream.map((creatures) =>
        creatures.toObject((c) => c.id)
      ),
      messageAuthor: this.$stream("viewMessage")
        .filter((m) => !!m)
        .pluck("whoId")
        .switchMap((id) =>
          GameService.getEntityStream(id, ENTITY_VARIANTS.DETAILS)
        ),
      lastReadTimestamp: lastReadTimestampStream,
      creaturesAtLocation: GameService.getLocationStream().map((location) =>
        location.creatures.toObject((cId) => cId)
      ),
    };
  },

  mounted() {
    this.newMessageText = LocalStorageService.getItem("typedChatMessage", "");
    this.$refs.textInput.focus();
  },

  methods: {
    onAction(...args) {
      this.viewMessage = null;
    },

    characterPresent(message) {
      return this.creaturesAtLocation[message.whoId];
    },

    selectEmo(emo) {
      this.emoSelector = false;
      this.currentEmo = emo;
    },

    onMessageVisibilityChange(message) {
      return (visible) => {
        if (visible && message.when > this.lastReadTimestamp) {
          ChatService.setLastReadTimestamp(message.when);
        }
      };
    },

    inputKeypress(event) {
      if (this.emoSelector) {
        event.preventDefault();
        if (event.key === ":") {
          return;
        }
        if (event.key === "Escape") {
          this.emoSelector = false;
          return;
        }
        const emo = EMOS.find((emo) => emo[1] === event.key.toUpperCase());
        if (emo) {
          this.emoSelector = false;
          this.currentEmo = emo;
          this.errorMsg = null;
        } else {
          this.errorMsg = `Invalid emotion, accepted characters: ${EMOS.map(
            (e) => e[1]
          ).join(" ")}`;
        }
        return;
      }

      if (event.key === "Enter") {
        this.sendMessage();
      }
      if (event.key === ":") {
        this.emoSelector = true;
        event.preventDefault();
      }
    },

    maintainBottomScroll() {
      const el = this.$refs.chatMessagesWrapper;
      if (!el) {
        return;
      }

      const isScrolledToBottom =
        el.scrollHeight <= el.scrollTop + el.clientHeight;
      if (isScrolledToBottom) {
        setTimeout(() => {
          this.scrollToNewest();
        });
      }
    },

    scrollToNewest() {
      const el = this.$refs.chatMessagesWrapper;
      if (el) {
        el.scrollTo(0, el.scrollHeight, {
          behavior: "smooth",
        });
      }
    },

    sendMessage() {
      this.sending = true;
      setTimeout(() => {
        GameService.request(REQUEST_CODES.CHAT_SEND_MESSAGE, {
          emo: this.currentEmo,
          msg: this.newMessageText,
        })
          .then((result) => {
            if (result === true) {
              this.newMessageText = "";
              this.currentEmo = EMOS.first();
            } else if (result?.ok === false) {
              this.errorMsg = result.message;
            } else {
              this.errorMsg = result;
            }
            this.sending = false;
            setTimeout(() => {
              this.$refs.textInput.focus();
            });
          })
          .catch(() => {
            this.sending = false;
            setTimeout(() => {
              this.$refs.textInput.focus();
            });
          });
      });
    },

    getCharacter(message) {
      if (!this.characters) {
        return;
      }
      return this.characters[message.whoId];
    },

    getCharacterName(message) {
      return this.getCharacter(message)?.name;
    },

    isOwnMessage(message) {
      return this.myCreature && this.myCreature.id === message.whoId;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../utils.scss";

.chat-panel {
  display: flex;
  flex-direction: column;
  position: relative;

  @media (orientation: landscape) {
    height: calc(var(--app-height) - 1rem);
  }

  @media (orientation: portrait) {
    height: 33.66rem;
  }

  .filler {
    min-height: 1rem;
    flex-grow: 1;
  }

  .chat-messages-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 0.5rem;
    overflow: auto;
    position: relative;
  }

  .chat-input {
    $height: 4.75rem;
    display: flex;
    min-height: $height;
    overflow: hidden;

    .message-input {
      flex-grow: 1;
    }

    .send-button {
      height: $height;
    }
  }

  .message-error {
    position: absolute;
    bottom: 5rem;
    padding: 1rem;
    background: #fdd;
    color: #540000;
    margin: 0.5rem;
    z-index: 25;
    border-radius: 1rem;
    border: 1px solid #540000;
    font-size: 75%;
  }
}

.message {
  display: flex;
  position: relative;
  margin-bottom: 1rem;

  .unread-marker {
    position: absolute;
    top: -1.26rem;
    left: 10%;
    width: 80%;
    display: flex;
    font-size: 1rem;
    text-align: center;
    filter: drop-shadow(0 0.1rem 0.1rem black);

    .left-connector,
    .right-connector {
      border: 0.6rem solid transparent;
      height: 0.2rem;
    }
    .left-connector {
      border-left-width: 0;
      border-right-color: darkred;
    }
    .right-connector {
      border-right-width: 0;
      border-left-color: darkred;
    }
    .left,
    .right {
      position: relative;
      right: -0.2rem;
      display: inline-block;
      flex-grow: 1;
      background: darkred;
      border-top: 0.55rem solid transparent;
      height: 0.2rem;
      background-clip: content-box;
    }
    .left {
      right: -0.2rem;
    }
    .right {
      right: 0.2rem;
    }
    .text {
      padding: 0.1rem 0.5rem;
      width: 7rem;
      background: darkred;
      white-space: nowrap;
      @include text-outline(black);
    }
  }

  .title {
    height: 1.575rem;
    font-size: 66%;
    display: flex;

    .name {
      font-style: italic;
    }

    .date {
      color: #a48774;
      padding: 0.25em 0.5em 0;
      font-size: 75%;
    }
  }

  .message-text {
    word-break: break-word;
    font-size: 80%;

    &.redacted {
      color: #777;
      font-style: italic;
    }
  }

  .message-avatar.absent {
    opacity: 0.4;
  }

  &:not(.own) {
    flex-direction: row;
    text-align: left;

    .message-avatar {
      margin-right: 1rem;
    }
  }
  &.own {
    flex-direction: row-reverse;
    text-align: right;

    .title-contents {
      flex-direction: row-reverse;
      display: flex;
    }

    .title {
      flex-direction: row-reverse;
    }

    .message-avatar {
      margin-left: 1rem;
    }
  }
}

.avatar-container {
  min-height: 4.75rem;
  min-width: 4.75rem + 1rem;
  display: flex;
}

.message {
  .report-message {
    margin-top: 0.75rem;
    margin-right: 0.5rem;
    font-size: 150%;
    opacity: 0.12;
    transition: opacity 0.1s linear;
  }
}

.emo-selector {
  position: relative;

  .emo-text {
    @include text-outline();
    position: absolute;
    font-size: 70%;
    top: 0.5rem;
    left: 0.75rem;
    z-index: 10;
  }
}
</style>
