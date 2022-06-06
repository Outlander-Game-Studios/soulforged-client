<template>
  <div>
    <Vertical>
      <Horizontal>
        <Input
          placeholder="Type your question here..."
          autoFocus
          v-model="question"
          class="flex-grow"
          @enter="$refs.submit.click()"
        />
        <Button ref="submit" @click="submitNewQuestion()">Submit</Button>
      </Horizontal>
      <Vertical class="similar-questions">
        <Header>Similar questions</Header>
        <LoadingPlaceholder v-if="loading" />
        <div class="empty-text" v-else-if="!question">
          Start typing to see similar questions
        </div>
        <div class="empty-text" v-else-if="question.length < minLetters">
          At least {{ minLetters }} characters are required to search for
          similar questions
        </div>
        <div class="empty-text" v-else-if="!similarQuestions.length">
          No similar questions found
        </div>
        <Header
          alt2
          v-else
          v-for="(similarQuestion, idx) in similarQuestions"
          :key="idx"
          class="interactive"
          @click="showSimilarQuestion(similarQuestion)"
        >
          {{ similarQuestion.question }}
        </Header>
      </Vertical>
      <Description>
        Your open questions:
        {{ operation.context.openQuestions.pendingCount }} /
        {{ MAX_PENDING_OPEN_QUESTIONS }}
      </Description>
    </Vertical>
    <Modal v-if="showingSimilarQuestion" @close="showingSimilarQuestion = null">
      <template v-slot:title>Question</template>
      <template v-slot:contents>
        <Vertical>
          <LabeledValue label="Question">
            {{ showingSimilarQuestion.question }}
          </LabeledValue>
          <div>
            <CreatureIcon
              :creatureId="operation.context.with"
              noSleep
              size="small"
              class="float-left"
            />
            <LabeledValue label="Answer">
              {{ showingSimilarQuestion.answer }}
            </LabeledValue>
          </div>
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
export default window.OperationDialogue = {
  props: {
    operation: {},
  },

  data: () => ({
    MAX_PENDING_OPEN_QUESTIONS,
    loading: false,
    minLetters: 3,
    question: "",
    similarQuestions: [],
    showingSimilarQuestion: null,
  }),

  watch: {
    question() {
      clearTimeout(this.checkSimilarTimeout);
      if (this.question.length >= this.minLetters) {
        this.loading = true;
        this.similarQuestions = [];
        this.checkSimilarTimeout = setTimeout(() => {
          this.checkSimilar();
        }, 500);
      } else {
        this.loading = false;
      }
    },
  },

  mounted() {
    if (this.operation.context.openQuestions.error) {
      ToastError(this.operation.context.openQuestions.error);
      this.$emit("close");
    }
  },

  methods: {
    showSimilarQuestion(similarQuestion) {
      this.showingSimilarQuestion = similarQuestion;
    },

    submitNewQuestion() {
      GameService.request(REQUEST_CODES.ASK_OPEN_QUESTIONS, {
        text: this.question,
      }).then((response) => {
        if (response?.ok === false) {
          ToastError(response.message);
        } else {
          const count = response.count;
          ToastSuccess(
            "Question Submitted",
            `${count} / ${MAX_PENDING_OPEN_QUESTIONS} pending`
          );
          GameService.getInfoStream("OpenQuestion", {}, true);
          this.$emit("close");
        }
      });
    },

    checkSimilar() {
      GameService.request(REQUEST_CODES.SIMILAR_OPEN_QUESTIONS, {
        text: this.question,
      })
        .then((response) => {
          if (response.throttled) {
            this.checkSimilarTimeout = setTimeout(() => {
              this.checkSimilar();
            }, 300);
            return;
          }
          this.loading = false;
          if (response?.ok === false) {
            ToastError(response.message);
          } else {
            this.similarQuestions = response;
          }
        })
        .catch((response) => {
          this.loading = false;
          ToastError(response);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.similar-questions {
  min-height: 27rem;
}
</style>
