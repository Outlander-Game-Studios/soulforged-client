<template>
  <div>
    <LoadingPlaceholder v-if="!versionsSinceLast" />
    <HorizontalFill v-else>
      <Vertical>
        <LoadingPlaceholder v-if="!versionsDetails" />
        <Vertical
          v-for="(versionChangelog, versionNumber) in versionsDetails"
          :key="versionNumber"
        >
          <Header small> Version {{ versionNumber }} </Header>
          <div>
            <div
              v-for="(items, category) in versionChangelog.changes"
              :key="category"
              class="item"
            >
              <div v-for="(text, idx) in items" :key="idx">
                <span class="symbol" :class="category" />
                <RichText class="change-text" :value="text" />
              </div>
            </div>
          </div>
        </Vertical>
      </Vertical>
      <Vertical>
        <Header small>Versions</Header>
        <Vertical class="version-selector">
          <Button
            v-for="version in versions"
            :key="version"
            @click="showSpecific(version)"
          >
            {{ version }}
          </Button>
        </Vertical>
      </Vertical>
    </HorizontalFill>
  </div>
</template>

<script>
import flatten from "lodash/flatten.js";
import Description from "../interface/Description";
import RichText from "./RichText";
import Vertical from "../layouts/Vertical";
import Horizontal from "../layouts/Horizontal";

export default {
  components: { Horizontal, Vertical, RichText, Description },
  data: () => ({
    showVersion: null,
    showSinceLast: true,
  }),

  subscriptions() {
    const versionsStream = GameService.getInfoStream("Changelog");
    const versionsToShow = Rx.combineLatest(
      this.$stream("showVersion"),
      versionsStream,
      GameService.getLastViewedVersionStream().first()
    ).map(([showVersion, versions, lastVersion]) => {
      const idx = versions.indexOf(lastVersion);
      if (idx <= 0 || !this.showSinceLast) {
        this.showSinceLast = false;
        return [showVersion];
      }
      this.showSinceLast = true;
      return versions.slice(0, idx);
    });
    return {
      versionsSinceLast: versionsToShow,
      versionsDetails: versionsToShow.switchMap((versions) => {
        return Rx.combineLatest(
          versions.map((version) =>
            GameService.getInfoStream("Changelog", {
              version,
            })
          )
        ).map((details) => details.toObject((detail, idx) => versions[idx]));
      }),
      versions: versionsStream,
      currentVersion: GameService.getVersionStream().tap((current) => {
        GameService.getInfoStream("Changelog", {
          updateLastVersion: true,
        });
        this.showVersion = current;
      }),
    };
  },

  methods: {
    showSpecific(version) {
      this.showVersion = version;
      this.showSinceLast = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.symbol {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin-right: 0.5rem;
  @include filter(
    drop-shadow(1px 1px 0 #111) drop-shadow(1px -1px 0 #111)
      drop-shadow(-1px 1px 0 #111) drop-shadow(-1px -1px 0 #111)
  );
  background-image: url(ui-asset("/emoji/question-mark.svg"));

  &.balance {
    background-image: url(ui-asset("/emoji/scales.svg"));
  }
  &.feature {
    background-image: url(ui-asset("/emoji/new.svg"));
  }
  &.interface {
    background-image: url(ui-asset("/emoji/screwdriver.svg"));
  }
  &.bugfix {
    background-image: url(ui-asset("/emoji/tools.svg"));
  }
  &.visual {
    background-image: url(ui-asset("/emoji/picture.svg"));
  }
}
.item {
  margin-bottom: 0.2rem;
}
.change-text {
  color: #444;
  line-height: 2rem;
  vertical-align: top;
  font-style: italic;
}

.version-selector {
  overflow: auto;
  max-height: 40rem;
  padding-bottom: 1rem;
}
</style>
