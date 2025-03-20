<template>
  <div v-if="pendingQuestions && pendingQuestions.length">
    <div class="open-questions-button" @click="showInfo = true">
      <BorderRound
        v-if="unreadCounter"
        class="unread-counter"
        :size="2.2"
        borderType="tightGlow"
        backgroundType="important"
      >
        {{ unreadCounter }}
      </BorderRound>
    </div>
    <Modal v-if="showInfo" @close="showInfo = false">
      <template v-slot:title>
        Pending questions
        <AskMeAnythingHelp />
      </template>
      <template v-slot:contents>
        <Vertical>
          <ListItem flexible v-for="(item, idx) in pendingQuestions" :key="idx" titleClass="wrap">
            <template v-slot:icon>
              <Icon :src="item.icon" :size="5" />
            </template>
            <template v-slot:title>
              {{ item.question }}
            </template>
            <template v-slot:subtitle>
              <div v-if="item.answer">Answered <span v-if="item.unread">(unread)</span></div>
              <Description v-else>Pending</Description>
            </template>
            <template v-slot:buttons>
              <Horizontal>
                <Button v-if="item.answer" @click="viewAnswer(item)"> View </Button>
                <Button v-if="!item.answer || !item.unread" @click="dismissing = item">
                  Dismiss
                </Button>
              </Horizontal>
            </template>
          </ListItem>
          <Description>
            Your open questions:
            {{ pendingQuestions.length }} / {{ MAX_PENDING_OPEN_QUESTIONS }}
          </Description>
        </Vertical>
      </template>
    </Modal>
    <Modal v-if="dismissing" dialog large @close="dismissing = false">
      <template v-slot:title> Dismiss question </template>
      <template v-slot:contents>
        <Vertical>
          <div>{{ dismissing.question }}</div>
          <Description>
            Are you sure you want to dismiss this question? This will free up a slot for you to ask
            other questions.
          </Description>
          <HorizontalCenter>
            <Button @click="dismiss()">Dismiss</Button>
          </HorizontalCenter>
        </Vertical>
      </template>
    </Modal>
    <Modal v-if="viewing" dialog @close="viewing = false">
      <template v-slot:title> Question </template>
      <template v-slot:contents>
        <Vertical>
          <Header>Question</Header>
          <div>{{ viewing.question }}</div>
          <template v-if="viewing.answer">
            <Horizontal>
              <Icon :src="viewing.icon" />
              <Vertical>
                <Header>Answer</Header>
                <div>{{ viewing.answer }}</div>
              </Vertical>
            </Horizontal>
          </template>
          <HorizontalCenter>
            <Button @click="dismissing = viewing">Dismiss</Button>
          </HorizontalCenter>
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
export default rxComponent({
  data: () => ({
    MAX_PENDING_OPEN_QUESTIONS,
    showInfo: false,
    dismissing: null,
    viewing: null,
  }),

  subscriptions() {
    const questionsStream = GameService.getInfoStream('OpenQuestion')
    return {
      pendingQuestions: questionsStream.tap((q) => {
        if (!q.length) {
          this.showInfo = false
        }
      }),
      unreadCounter: questionsStream.map((qs) => qs.filter((q) => q.answer && q.unread).length),
    }
  },

  methods: {
    viewAnswer(question) {
      this.viewing = question
      if (question.unread) {
        GameService.request(REQUEST_CODES.MARK_OPEN_QUESTION_VIEWED, {
          openQuestionId: question.id,
        }).then(() => {
          GameService.getInfoStream('OpenQuestion', {}, true)
        })
      }
    },

    dismiss() {
      GameService.request(REQUEST_CODES.DISMISS_OPEN_QUESTIONS, {
        openQuestionId: this.dismissing.id,
      }).then((response) => {
        if (response?.ok === false) {
          ToastError(response.message)
        } else {
          GameService.getInfoStream('OpenQuestion', {}, true)
          this.viewing = null
          this.dismissing = null
        }
      })
    },
  },
})
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.open-questions-button {
  $size: 5rem;
  width: $size;
  height: $size;
  background-image: url(ui-asset('/icons/ama.png'));
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
  margin-bottom: 1rem;
  @include utils.filter(drop-shadow(0.3rem 0.3rem 0.3rem black));

  @media (orientation: portrait) {
    margin-bottom: 0;
    margin-right: 1rem;
  }

  &:hover {
    @include utils.filter(drop-shadow(0.3rem 0.3rem 0.3rem black) brightness(1.2));
  }
}

.unread-counter {
  position: absolute !important;
  top: 0;
  right: 0;
}
</style>
