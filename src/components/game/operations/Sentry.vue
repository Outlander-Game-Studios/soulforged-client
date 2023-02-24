<template>
  <div class="sentry-mode">
    <CloseButton class="close-button" @click="cancel()" />
    <Vertical class="flex-grow" flex>
      <Header>Observing</Header>
      <Header alt2>Filter captured events</Header>
      <HorizontalWrap>
        <Checkbox
          v-for="(filter, label) in FILTERS"
          @input="toggleFilter(filter, $event)"
          v-model="operation.context.typeFilters[filter]"
        >
          {{ label }}
        </Checkbox>
      </HorizontalWrap>
      <Header alt2>Log ({{ logs.length }} / {{ SENTRY_LIMIT }})</Header>
      <Input placeholder="Search logs" v-model="textFilter" />
      <div class="log-table-wrapper">
        <table class="log-table">
          <tr>
            <th class="interactive info-header" @click="setSort('info')">
              Info {{ sortIndicator.info }}
            </th>
            <th class="interactive date-header" @click="setSort('first')">
              First time {{ sortIndicator.first }}
            </th>
            <th class="interactive date-header" @click="setSort('last')">
              Last time {{ sortIndicator.last }}
            </th>
          </tr>
          <tr v-for="logRow in logsSortedAndFiltered">
            <td><RichText :value="logRow.text" html /> x{{ logRow.count }}</td>
            <td class="nowrap">{{ logRow.firstText }}</td>
            <td
              class="nowrap"
              :class="{ unimportant: logRow.last === logRow.first }"
            >
              {{ logRow.lastText }}
            </td>
          </tr>
        </table>
        <div class="empty-text" v-if="!logs.length">No entries</div>
      </div>
      <div class="big-warning" v-if="operation.context.overflow">
        {{ operation.context.overflow }} messages lost due to limit
      </div>
      <HorizontalFill>
        <Button @click="purging = true" type="reject">Erase</Button>
        <Button @click="exporting = true">Export</Button>
      </HorizontalFill>
      <div></div>
    </Vertical>
    <Modal v-if="purging" dialog @close="purging = false" title="Erase log">
      <Vertical>
        <div class="important-text">
          Are you sure you want to erase the log data? Doing this will free up
          space for more new entries.
        </div>
        <HorizontalCenter>
          <Button @click="purge()">Confirm</Button>
        </HorizontalCenter>
      </Vertical>
    </Modal>
    <Modal
      v-if="exporting"
      dialog
      @close="exporting = false"
      title="Export log"
    >
      <Vertical>
        <textarea :value="exportValue" readonly> </textarea>
      </Vertical>
    </Modal>
  </div>
</template>

<script>
export default window.OperationSentry = {
  props: {
    operation: {},
  },

  data: () => ({
    SENTRY_LIMIT,
    textFilter: "",
    purging: false,
    exporting: false,
    sorting: {
      value: "first",
      dir: -1,
    },
    FILTERS: Object.keys(SENTRY_EVENT_TYPE).toObject(
      (key) => SENTRY_EVENT_LABEL[key],
      (key) => SENTRY_EVENT_TYPE[key]
    ),
  }),

  computed: {
    exportValue() {
      function formatExportDate(number) {
        try {
          return new Date(number)
            .toLocaleString("en-GB", {
              timeZone: "Europe/London",
              timeZoneName: "shortOffset",
            })
            .replace(/,/g, "");
        } catch (e) {
          return new Date(number).toString();
        }
      }
      return this.logsSortedAndFiltered
        .map((row) =>
          [
            this.stripInfo(row.text),
            formatExportDate(row.first),
            formatExportDate(row.last),
          ].join(",")
        )
        .join("\n");
    },
    sortIndicator() {
      console.log(this.exportValue);
      const indicators = {
        info: "",
        first: "",
        last: "",
      };
      indicators[this.sorting.value] = this.sorting.dir > 0 ? "▲" : "▼";
      return indicators;
    },
    sorter() {
      if (this.sorting.value === "info") {
        return compareStrings;
      }
      return (a, b) => b[this.sorting.value] - a[this.sorting.value];
    },
    logs() {
      return this.operation.context.logs;
    },
    logsSortedAndFiltered() {
      const textFilter = this.textFilter.toLowerCase();
      return this.logs
        .map((log) => ({
          ...log,
          firstText: this.formatDate(log.first),
          lastText: this.formatDate(log.last),
        }))
        .filter(
          (log) =>
            !textFilter ||
            this.stripInfo(log.text).toLowerCase().includes(textFilter)
        )
        .sort((a, b) => this.sorter(a, b) * this.sorting.dir);
    },
  },

  methods: {
    stripInfo(text) {
      return GameService.stripRichText(text).replace(/<\/?em>/g, "");
    },
    formatDate(date) {
      const dateFull = new Date(date);
      const extra =
        new Date().getTime() - date < 5 * DAYS * IN_MILISECONDS
          ? DAYS_OF_WEEK_SHORT[dateFull.getDay()]
          : dateFull.getDate() + " " + MONTHS_SHORT[dateFull.getMonth()];
      return dateFull.toLocaleTimeString() + ", " + extra;
    },
    setSort(value) {
      if (this.sorting.value === value) {
        this.sorting.dir = -this.sorting.dir;
      } else {
        this.sorting.value = value;
        this.sorting.dir = 1;
      }
    },
    toggleFilter(type, value) {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: "setFilter",
        type,
        value,
      });
    },
    purge() {
      this.purging = false;
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: "purge",
      });
    },
    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION);
    },
  },
};
</script>

<style scoped lang="scss">
.sentry-mode {
  display: flex;
  flex-direction: column;

  @media (orientation: landscape) {
    width: 50rem;
    height: min(var(--app-height) - 18rem, 85rem);
  }
  @media (orientation: portrait) {
    width: calc(0.82 * var(--app-width));
    height: min(var(--app-height) - 30rem, 85rem);
  }
}

.log-table-wrapper {
  flex-grow: 1;
}

.log-table {
  font-size: 70%;

  tr:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  .info-header {
    width: 100%;
  }
  .date-header {
    width: 0;
    white-space: nowrap;
  }

  td,
  th {
    padding: 0.2rem 0.7rem;

    &.unimportant {
      opacity: 0.3;
    }
  }
}

textarea {
  background: beige;
  width: max(60vw, 40rem);
  height: min(60vh, 60rem);
}
</style>
