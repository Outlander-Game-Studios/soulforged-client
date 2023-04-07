<template>
  <div>
    <div class="combat-container" v-if="combat">
      <CreatureDetailsModal
        :creatureId="selectedCreatureId"
        @close="selectedCreatureId = null"
      />
      <Modal
        dialog
        v-if="selectingWeapon"
        title="Select weapon"
        @close="selectingWeapon = null"
      >
        <Spaced>
          <Description>
            Swapping weapon will stop you from<br />
            counter-attacking until your next turn<br />
            <br />
            It will also put all of the skills of the<br />
            newly equipped item on minimum {{ SWAP_COOLDOWN }} turn cooldown
          </Description>
        </Spaced>
        <div class="select-weapon">
          <ItemSelector
            :filter="itemWeaponFilter()"
            @selected="selectWeapon($event)"
            :itemVariant="ENTITY_VARIANTS.DETAILS"
          >
            <template v-slot="{ item }">
              <CombatMoves
                class="item-combat-moves"
                showDetailsOnClick
                wrap
                :moves="item.combatMoves"
              />
            </template>
          </ItemSelector>
        </div>
      </Modal>
      <Modal
        dialog
        v-if="selectingOffhand"
        title="Select offhand"
        @close="selectingOffhand = null"
      >
        <Spaced>
          <Description>
            Swapping offhand will stop you from<br />
            counter-attacking until your next turn<br />
            <br />
            It will also put all of the skills of the<br />
            newly equipped item on minimum {{ SWAP_COOLDOWN }} turn cooldown
          </Description>
        </Spaced>
        <div class="select-weapon">
          <ItemSelector
            :filter="itemOffhandFilter()"
            @selected="selectOffhand($event)"
          >
            <template v-slot="{ item }"> </template>
          </ItemSelector>
        </div>
      </Modal>
      <Modal
        v-if="skipping && !combat.concluded"
        dialog
        large
        v-on="combat.autoResolving ? {} : { close: () => (skipping = false) }"
      >
        <template v-slot:title> Auto-resolve </template>
        <template v-slot:contents>
          <div v-if="combat.autoResolving">
            <Vertical>
              <Description>Auto-resolving combat...</Description>
              <ProgressBar
                color="orange"
                :current="
                  (100 * (AUTO_RESOLVE_TURNS - combat.autoResolving)) /
                  AUTO_RESOLVE_TURNS
                "
              >
                <div class="auto-resolve-count">
                  {{ AUTO_RESOLVE_TURNS - combat.autoResolving }} /
                  {{ AUTO_RESOLVE_TURNS }}
                </div>
              </ProgressBar>
            </Vertical>
          </div>
          <div v-else>
            <Vertical>
              <Description>
                This will attempt to resolve combat by automatically executing
                up to
                <em>{{ AUTO_RESOLVE_TURNS }}</em>
                following turns.<br />
                Your character will use the currently selected move:
              </Description>
              <Header alt2>Select move to auto-resolve combat with</Header>
              <HorizontalCenter>
                <CombatMoves
                  @selected="autoResolveMove = $event"
                  :selectedMoveId="autoResolveMove"
                  wrap
                  autoResolveOnly
                  noSpacing
                />
              </HorizontalCenter>
              <HorizontalCenter>
                <Button
                  @click="triggerAutoResolve(autoResolveMove)"
                  :disabled="!autoResolveMove"
                >
                  Confirm
                </Button>
              </HorizontalCenter>
            </Vertical>
          </div>
        </template>
      </Modal>
      <template v-if="inBattle">
        <div class="main-area">
          <Button
            v-if="combat.canAutoResolve"
            class="skipping-button"
            @click="skipping = true"
          >
            Auto-resolve
          </Button>
          <div v-if="selectedMove && timeRemaining" class="move-info">
            <CloseButton
              class="move-preview-close"
              @click="selectedMoveId = null"
            />
            <Container borderType="alt" :borderSize="0.8">
              <Vertical>
                <Header small>
                  {{ selectedMove.name }}
                </Header>
                <Spaced>
                  <CombatMoveDetails :moveDetails="selectedMove" noIcon />
                </Spaced>
                <Button @click="selectMove(selectedMoveId)" reactToEnter
                  >Perform</Button
                >
              </Vertical>
            </Container>
          </div>
          <div class="creatures">
            <div
              v-for="creature in displayedCreatures"
              :key="creature.id"
              class="creature"
              :style="creatureStyle(creature)"
              :class="creatureCssClass(creature)"
            >
              <div class="markers">
                <div
                  class="marker current-target"
                  :style="targetIconStyle"
                  v-if="operation.context.currentTarget === creature.id"
                />
                <div
                  class="marker current-turn"
                  :style="turnIconStyle"
                  v-if="combat.creatureTurn === creature.id"
                />
              </div>
              <div class="effects-wrapper">
                <div class="effects">
                  <Effects
                    row
                    wrap
                    :effects="creature.effects"
                    :size="3"
                    :filter="combatEffectFilter"
                    group
                  />
                </div>
                <div class="effects">
                  <Effects
                    row
                    :effects="creature.effects"
                    :size="2.5"
                    :filter="nonCombatEffectFilter"
                  />
                </div>
              </div>
              <CreatureIcon
                class="avatar"
                :creature="creature"
                size="large"
                noOperation
                @click="clickedCreature(creature)"
                noSleep
                moveIndicator
              />
              <div
                v-for="floatingCombatText in floatingCombatTexts[creature.id]"
                :key="floatingCombatText.floatingCombatId"
                class="floating-combat-text"
              >
                <HitText
                  :hitLevel="floatingCombatText.damageInfo.hitMultiplier"
                />
                <div
                  v-if="
                    floatingCombatText.damageInfo.type === ATTACK_OUTCOMES.MISS
                  "
                />
                <div
                  class="no-damage"
                  v-else-if="!floatingCombatText.damageInfo.effects.length"
                >
                  No damage
                </div>
                <HorizontalCenter tight v-else>
                  <div
                    v-for="(effect, idx) in floatingCombatText.damageInfo
                      .effects"
                    :key="idx"
                  >
                    <EffectIcon :effect="effect" :size="2.4" />
                  </div>
                </HorizontalCenter>
                <HorizontalCenter tight>
                  <div
                    v-for="(effect, idx) in floatingCombatText.damageInfo
                      .effectsCombat"
                    :key="idx"
                  >
                    <EffectIcon :effect="effect" :size="2.8" />
                  </div>
                </HorizontalCenter>
                <!--              </Container>-->
                <!--                {{ floatingCombatText.damageInfo }}-->
              </div>
              <div
                class="flee-indicator"
                v-if="combat.fleeing[creature.id]"
                :key="'flee' + creature.id"
              >
                <div class="flee-icon" :style="fleeIconStyle"></div>
                <div
                  class="percentage"
                  v-if="combat.fleeing[creature.id] < 100"
                >
                  {{ combat.fleeing[creature.id] }}%
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="top-controls">
          <div class="game-help-container">
            <GameHelpModule />
          </div>
          <div
            v-for="bigText in bigTexts"
            class="big-text"
            :class="bigText.cssClass"
            :style="bigText.style"
          >
            {{ bigText.text }}
          </div>
          <ProgressBar
            class="turn-timer"
            v-if="timeRemaining && combat.running"
            :current="(100 * timeRemaining) / timeMax"
            :size="2.5"
            color="blue"
          />
        </div>
        <div>
          <Container borderSize="0.5" class="effects-container">
            <Effects row :effects="mainEntity.effects" :size="4" />
          </Container>
        </div>
        <div class="relative">
          <div class="targetting-overlay" v-if="targetting">
            <div class="text">Select your target</div>
            <HorizontalCenter>
              <Button @click="targetting = false">Cancel</Button>
            </HorizontalCenter>
          </div>
          <Container borderType="alt">
            <Spaced>
              <Horizontal>
                <Vertical :class="{ 'not-your-turn': !timeRemaining }">
                  <Header alt2 small>Weapon</Header>
                  <HorizontalCenter>
                    <Item
                      v-if="weapon"
                      :data="weapon"
                      @click="selectingWeapon = true"
                      :size="7"
                    />
                    <Icon
                      v-else
                      class="interactive"
                      @click="selectingWeapon = true"
                      :size="7"
                    />
                  </HorizontalCenter>
                </Vertical>
                <Vertical :class="{ 'not-your-turn': !timeRemaining }">
                  <Header alt2 small>Offhand</Header>
                  <HorizontalCenter>
                    <Item
                      v-if="offhand"
                      :data="offhand"
                      @click="selectingOffhand = true"
                      :size="7"
                    />
                    <Icon
                      v-else
                      class="interactive"
                      @click="selectingOffhand = true"
                      :size="7"
                    />
                  </HorizontalCenter>
                </Vertical>
                <div
                  class="flex-grow"
                  :class="{ 'not-your-turn': !timeRemaining }"
                >
                  <Vertical>
                    <Header alt2 small>
                      <Horizontal tight>
                        <div class="flex-grow">Abilities</div>
                        <div class="skip-confirm">
                          <Checkbox v-model="skipConfirm"
                            >Skip confirm</Checkbox
                          >
                        </div>
                      </Horizontal>
                    </Header>
                    <CombatMoves
                      class="flex-grow"
                      :currentMove="operation.context.currentMoveId"
                      @selected="selectMove($event)"
                      wrap
                      :selectedMoveId="selectedMoveId"
                    />
                  </Vertical>
                </div>
                <Vertical flex>
                  <Header alt2 small>Target</Header>
                  <HorizontalCenter>
                    <Button noPadding @click="targetting = true">
                      <div class="icon" :style="targetIconStyle" />
                    </Button>
                  </HorizontalCenter>
                </Vertical>
              </Horizontal>
            </Spaced>
          </Container>
        </div>
      </template>
      <template v-else>
        <div class="combat-summary">
          <Spaced>
            <Vertical>
              <HorizontalCenter>
                <Header veryLarge v-if="operation.lost"
                  >You lost the fight!</Header
                >
                <Header veryLarge v-else-if="operation.fled">You fled.</Header>
                <Header veryLarge v-else>Victory!</Header>
              </HorizontalCenter>
              <HorizontalCenter>
                <Button @click="cancel()">Finish</Button>
              </HorizontalCenter>
              <DynamicLayout>
                <HorizontalFill v-if="loot && !operation.fled">
                  <Container class="loot-section">
                    <Spaced>
                      <Header>Loot</Header>
                      <div class="loot-list">
                        <Inventory :inventory="loot" />
                      </div>
                      <HorizontalCenter v-if="loot && loot.length">
                        <Button @click="lootAll()"> Loot all </Button>
                      </HorizontalCenter>
                    </Spaced>
                  </Container>
                </HorizontalFill>
                <HorizontalFill
                  v-if="
                    operation.context.summary &&
                    (operation.context.summary.skills.length ||
                      operation.context.summary.effects.length ||
                      operation.context.summary.mobKnowledge.length)
                  "
                >
                  <Container class="summary-section">
                    <Spaced>
                      <LoadingPlaceholder v-if="!operation.context.summary" />
                      <Vertical v-else>
                        <Header>Summary</Header>
                        <template
                          v-if="operation.context.summary.skills.length"
                        >
                          <Header alt2>Skills</Header>
                          <Horizontal
                            v-for="skill in operation.context.summary.skills"
                            :key="skill.name"
                          >
                            <SkillBar
                              :skillName="skill.name"
                              :skillLevel="skill.level"
                              class="flex-grow"
                            />
                            <span class="gained-text">
                              <Plused :value="skill.gain" />
                            </span>
                          </Horizontal>
                        </template>
                        <template
                          v-if="operation.context.summary.effects.length"
                        >
                          <Header alt2>Effects</Header>
                          <Effects
                            :effects="operation.context.summary.effects"
                          />
                        </template>
                        <template
                          v-if="operation.context.summary.mobKnowledge.length"
                        >
                          <Header alt2>Monster Knowledge</Header>
                          <ListItem
                            v-for="mobKnowledge in operation.context.summary
                              .mobKnowledge"
                            :key="mobKnowledge.name"
                            :iconSize="4"
                            :iconSrc="mobKnowledge.icon"
                            flexible
                            @click="showMobInfoDetails = mobKnowledge"
                          >
                            <template v-slot:title>
                              <RichText :value="mobKnowledge.name" />
                              Level:
                              {{ mobKnowledge.info.mobExpLevel }}
                            </template>
                            <template v-slot:subtitle>
                              <CreatureKnowledgeBar
                                :mobInfo="mobKnowledge.info"
                              />
                            </template>
                            <template v-slot:buttons>
                              <span class="gained-text">
                                <Plused :value="mobKnowledge.gained" />
                              </span>
                            </template>
                          </ListItem>
                        </template>
                      </Vertical>
                    </Spaced>
                  </Container>
                </HorizontalFill>
              </DynamicLayout>
            </Vertical>
          </Spaced>
        </div>
      </template>
      <Modal
        dialog
        v-if="showMobInfoDetails"
        @close="showMobInfoDetails = null"
      >
        <template v-slot:title>
          <RichText :value="showMobInfoDetails.name" />
        </template>
        <template v-slot:contents>
          <CreatureKnowledgeLevelInfo :mobInfo="showMobInfoDetails.info" />
        </template>
      </Modal>
      <Modal dialog v-if="!combat.running && !combat.finished">
        <template v-slot:title>
          Combat Paused
          <Help title="Combat Pause">
            When any player participating in combat disconnects the combat is
            automatically paused.<br />
            It can only be resumed once all players are connected back again or
            it will be resumed automatically when the pause timer runs out.
          </Help>
        </template>
        <template v-slot:contents>
          <Vertical>
            <div
              class="paused-modal-text"
              v-if="combat.disconnectedCharacters.length"
            >
              Waiting for players to reconnect:
              <em>{{ combat.disconnectedCharacters.join(", ") }}</em>
            </div>
            <div class="paused-modal-text" v-if="combat.pauseTimeLeft">
              Time remaining:
              <em>
                <Countdown :seconds="combat.pauseTimeLeft" />
              </em>
            </div>
            <div v-else class="paused-modal-text">
              The combat is paused due to server restart.
            </div>
            <HorizontalCenter>
              <Button @click="resume()" :disabled="!combat.canResume"
                >Resume</Button
              >
            </HorizontalCenter>
          </Vertical>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script>
import fleeIcon from "../operation-assets/flee.png";
import targetIcon from "../operation-assets/target.png";
import turnIcon from "../operation-assets/combat-turn.png";
import promptSound from "../../../assets/sounds/prompt2.ogg";
import omit from "lodash/omit.js";

const BIG_TEXT_CLASS = {
  DEFAULT: "default",
  NEUTRAL: "neutral",
  GREAT: "great",
  GOOD: "good",
  POOR: "poor",
  BAD: "bad",
};

const positions = [
  [75, 50],
  [30, 10],
  [20, 90],
  [0, 55],
  [100, 5],
  [90, 100],
  [50, 22],
  [90, 30],
  [100, 70],
  [55, 95],
  [5, 100],
  [45, 40],
  [50, 65],
  [5, 75],
  [85, 85],
  [10, 33],
  [70, 15],
];

const STANCES = {
  IDLE: 1,
  ATTACKING: 2,
  DEFENDING: 3,
};
const ANIMATIONS = {
  ATTACKING: 1,
  BEING_HIT: 2,
};

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const nonCombatEffectFilter = (effect) => !effect.durationTurns;
const combatEffectFilter = (effect) => !!effect.durationTurns;

export default window.OperationCombat = {
  FULLSCREEN: true,
  props: {
    operation: {},
  },

  data: () => ({
    AUTO_RESOLVE_TURNS,
    SWAP_COOLDOWN,
    ENTITY_VARIANTS,
    autoResolveMove: null,
    skipping: false,
    targetting: false,
    selectingWeapon: false,
    selectingOffhand: false,
    creaturePositions: {},
    damageQueue: [],
    damagePresentation: null,
    displayedCreatures: {},
    selectedCreatureId: null,
    floatingCombatTexts: {},
    ATTACK_OUTCOMES: global.ATTACK_OUTCOMES,
    nonCombatEffectFilter,
    combatEffectFilter,
    timeMax: 8000,
    timeRemaining: null,
    bigTexts: {},
    selectedMoveId: null,
    skipConfirm: true,
    showMobInfoDetails: null,
  }),

  watch: {
    operation() {
      this.updateConsideredAP();
    },
    skipConfirm() {
      LocalStorageService.setItem("combat-skipConfirm", this.skipConfirm);
    },
  },

  computed: {
    inBattle() {
      return (
        !this.combat.finished && !this.operation.fled && !this.operation.lost
      );
    },
    fleeIconStyle() {
      return {
        backgroundImage: `url("${GameService.getSecureResource(fleeIcon)}")`,
      };
    },
    targetIconStyle() {
      return {
        backgroundImage: `url("${GameService.getSecureResource(targetIcon)}")`,
      };
    },
    turnIconStyle() {
      return {
        backgroundImage: `url("${GameService.getSecureResource(turnIcon)}")`,
      };
    },
  },

  subscriptions() {
    this.friendlyPositionsTaken = 0;
    this.hostilePositionsTaken = 0;

    const combatStream = this.$stream("operation")
      .pluck("combatEngagement")
      .distinctUntilChanged()
      .switchMap((id) => GameService.getEntityStream(id));
    const creaturesStream = combatStream
      .map((combat) =>
        combat ? [...combat.creatures, ...combat.benchedCreatures] : []
      )
      .switchMap((ids) =>
        GameService.getEntitiesStream(ids, ENTITY_VARIANTS.DETAILS)
      );

    return {
      combat: combatStream.tap((combat) => {
        this.timeRemaining = combat.timeLeft;
        this.timeMax = Math.max(this.timeMax, this.timeRemaining || 0);
      }),
      ownFleeProgress: Rx.combineLatest(
        combatStream,
        GameService.getRootEntityStream().pluck("id").distinctUntilChanged()
      )
        .map(([combat, mainEntityId]) => combat.fleeing[mainEntityId] || 0)
        .tap((fleeProgress) => {
          if (fleeProgress > this.ownFleeProgress) {
            this.displayBigText(`Fleeing progress ${fleeProgress}%`);
          }
        }),
      currentMove: this.$stream("operation")
        .pluck("context", "currentMoveId")
        .switchMap((moveId) =>
          GameService.getRootEntityStream().map((entity) =>
            entity?.combatStats?.moves?.find((m) => m.moveId === moveId)
          )
        ),
      selectedMove: this.$stream("selectedMoveId").switchMap((selectedMoveId) =>
        !selectedMoveId
          ? Rx.Observable.of(null)
          : GameService.getInfoStream(
              "CombatMove",
              {
                moveId: selectedMoveId,
              },
              true
            )
      ),
      loot: combatStream
        .pluck("loot")
        .switchMap((ids) => GameService.getEntitiesStream(ids)),
      mainEntity: GameService.getRootEntityStream(),
      backdropImage: GameService.getBackdropStyleStream(),
      weapon: GameService.getWeaponStream(),
      offhand: GameService.getOffhandStream(),
      damages: combatStream
        .pluck("damages")
        .filter((damages) => !!damages)
        .distinctUntilChanged((prev, curr) => prev.damagesId === curr.damagesId)
        .tap((damages) => {
          this.queueDamages(damages);
        }),
      ownTurn: Rx.combineLatest(
        combatStream.pluck("creatureTurn").distinctUntilChanged(),
        GameService.getRootEntityStream().pluck("id")
      )
        .map(([creatureId, ownId]) => creatureId === ownId)
        .distinctUntilChanged()
        .tap((ownTurn) => {
          if (ownTurn && !this.combat.autoResolving) {
            this.displayBigText("Your turn!", BIG_TEXT_CLASS.NEUTRAL);
            SoundService.playSound(promptSound);
          }
        }),
      creatures: creaturesStream
        .tap((creatures) => {
          creatures.forEach((creature) => {
            this.$set(this.displayedCreatures, creature.id, creature);
          });
        })
        .map((creatures) => {
          creatures.forEach((creature) => {
            if (!this.creaturePositions[creature.id]) {
              const positionIdx = creature.hostile
                ? this.hostilePositionsTaken++
                : this.friendlyPositionsTaken++;
              const pickedPosition = positions[positionIdx % positions.length];
              const offset = Math.floor(positionIdx / positions.length);
              const position = {
                x:
                  (creature.hostile ? -0.33 : 0.33) * pickedPosition[0] +
                  (creature.hostile ? 100 : 0) +
                  offset * 2,
                y: pickedPosition[1] - offset * 2,
              };
              this.$set(this.creaturePositions, creature.id, {
                animation: null,
                stance: STANCES.IDLE,
                initial: { ...position },
                current: { ...position },
              });
              return creature;
            }
          });
          return creatures.toObject((creature) => creature.id);
        }),
    };
  },

  mounted() {
    ControlsService.triggerControlEvent("notificationOffset", true);
    this.updateConsideredAP();
    this.initiateTimerCountdown();
    this.skipConfirm = LocalStorageService.getItem("combat-skipConfirm", true);
  },

  beforeDestroy() {
    ControlsService.triggerControlEvent("notificationOffset", false);
    ControlsService.updateConsideredAP(0);
  },

  methods: {
    initiateTimerCountdown() {
      const resolution = 50;
      this.timerInterval = setInterval(() => {
        if (this.timeRemaining) {
          this.timeRemaining = this.timeRemaining -= resolution;
          if (this.timeRemaining < 0) {
            this.timeRemaining = null;
          }
        }
      }, resolution);
    },

    displayBigText(text, cssClass = BIG_TEXT_CLASS.DEFAULT) {
      const duration = 1500;
      const resolution = 100;
      const interval = ControlsService.setAnimationInterval(() => {
        nextBigText.stage = nextBigText.stage += 1;
        if (nextBigText.stage >= resolution) {
          clearInterval(nextBigText.interval);
          this.bigTexts = omit(this.bigTexts, nextBigText.id);
        } else {
          const step = nextBigText.stage / resolution;
          nextBigText.style = {
            opacity: 2 - step * 2,
            fontSize: `${200 + 100 * (1 - step)}%`,
            marginBottom: `${15 * step}rem`,
          };
        }
      }, duration / resolution);
      const id = new Date().getTime();
      const nextBigText = {
        id,
        text,
        cssClass,
        interval,
        style: {},
        stage: 0,
      };
      this.bigTexts = {
        ...this.bigTexts,
        [id]: nextBigText,
      };
    },

    clickedCreature(creature) {
      if (this.targetting) {
        GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
          updateType: "selectTarget",
          creatureId: creature.id,
        }).then((result) => {
          if (result && result.ok) {
            this.targetting = false;
          } else {
            ToastError(result.message);
          }
        });
      } else {
        this.selectedCreatureId = creature.id;
      }
    },

    lootAll() {
      if (this.loot) {
        this.loot.forEach((item) => {
          GameService.performAction(
            item,
            { actionId: "loot" },
            { amount: item.amount }
          );
        });
      }
    },

    itemOffhandFilter() {
      return (item) =>
        item.actions.some((a) =>
          ["equip_Offhand", "un_equip_Offhand"].includes(a.actionId)
        );
    },
    selectOffhand(item) {
      if (!item) {
        if (this.offhand) {
          GameService.performAction(this.offhand, {
            actionId: "un_equip_Offhand",
          });
        }
      } else {
        if (item.actions.some((a) => a.actionId === "un_equip_Offhand")) {
          ToastError("Already equipped");
          return;
        }
        GameService.performAction(item, { actionId: "equip_Offhand" });
      }
      this.selectingOffhand = false;
      this.selectedMoveId = null;
    },

    itemWeaponFilter() {
      return (item) =>
        item.actions.some((a) =>
          ["equip_Weapon", "un_equip_Weapon"].includes(a.actionId)
        );
    },
    selectWeapon(item) {
      if (!item) {
        if (this.weapon) {
          GameService.performAction(this.weapon, {
            actionId: "un_equip_Weapon",
          });
        }
      } else {
        if (item.actions.some((a) => a.actionId === "un_equip_Weapon")) {
          ToastError("Already equipped");
          return;
        }
        GameService.performAction(item, { actionId: "equip_Weapon" });
      }
      this.selectingWeapon = false;
      this.selectedMoveId = null;
    },

    executeMove(moveId) {
      GameService.request(REQUEST_CODES.COMMENCE_OPERATION, {
        moveId,
      }).then(() => {
        this.performingMove = false;
      });
    },

    selectMove(moveId) {
      if (this.timeRemaining && !this.performingMove) {
        if (this.selectedMoveId === moveId || this.skipConfirm) {
          this.performingMove = true;
          GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
            updateType: "selectMove",
            moveId,
          }).then((response) => {
            if (!response || !response.ok) {
              this.performingMove = false;
              ToastError(response && response.message);
              return;
            }
            this.selectedMoveId = null;
            this.executeMove(moveId);
          });
        } else {
          this.selectedMoveId = moveId;
        }
      }
    },

    triggerAutoResolve(moveId) {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: "selectMove",
        moveId,
      }).then((response) => {
        GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
          updateType: "autoResolve",
        }).then((response) => {
          if (response?.ok === false) {
            ToastError(response.message);
          }
        });
      });
    },

    resume() {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: "resume",
      });
    },

    creatureStyle(creature) {
      const positioning = this.creaturePositions[creature.id];
      let offsetX = 0;
      if (this.damagePresentation && positioning.stance === STANCES.ATTACKING) {
        const target = this.displayedCreatures[
          this.damagePresentation.defenderId
        ];
        offsetX = (target && target.hostile ? -1 : 1) * 9.8;
      }
      return {
        left: `calc(${positioning.current.x}% + ${offsetX}rem)`,
        top: `${positioning.current.y}%`,
        zIndex: positioning.current.y,
      };
    },

    creatureCssClass(creature) {
      const positioning = this.creaturePositions[creature.id];
      const target =
        this.damagePresentation &&
        this.displayedCreatures[this.damagePresentation.defenderId];
      return {
        hostile: creature.hostile,
        fled: this.combat.fleeing[creature.id] >= 100,
        "from-left":
          (positioning.stance === STANCES.ATTACKING &&
            target &&
            target.hostile) ||
          (positioning.stance === STANCES.DEFENDING && !creature.hostile),
        "from-right":
          (positioning.stance === STANCES.ATTACKING &&
            target &&
            !target.hostile) ||
          (positioning.stance === STANCES.DEFENDING && creature.hostile),
        "animation-attacking": positioning.animation === ANIMATIONS.ATTACKING,
        "animation-being-hit": positioning.animation === ANIMATIONS.BEING_HIT,
      };
    },

    queueDamages(damages) {
      this.damageQueue.push(damages);
      if (!this.damagePresentation) {
        this.nextDamages();
      }
    },
    async nextDamages() {
      const damages = this.damageQueue.shift();
      if (!damages) {
        return;
      }
      this.damagePresentation = damages;
      await this.attackerApproaches(damages);
      await this.attackDefender(damages);
      await this.defenderRetaliates(damages);
      await this.attackerGoesBack(damages);
      this.damagePresentation = null;
      setTimeout(() => this.nextDamages());
    },
    async attackerApproaches(damages) {
      const attackerId = damages.attackerId;
      const defenderId = damages.defenderId;
      if (
        !this.creaturePositions[attackerId] ||
        !this.creaturePositions[attackerId]
      ) {
        return;
      }
      this.creaturePositions[attackerId].stance = STANCES.ATTACKING;
      this.creaturePositions[attackerId].current = {
        ...this.creaturePositions[defenderId].initial,
      };
      this.creaturePositions[defenderId].stance = STANCES.DEFENDING;
      // update creature position
      await wait(100);
    },
    async attackDefender(damages) {
      // update creature position
      if (!damages.attackerDamageDealt) {
        return;
      }
      for (const attackerDamageDealt of damages.attackerDamageDealt) {
        const attackerId = damages.attackerId;
        const defenderId = damages.defenderId;
        if (damages.resultInfo) {
          this.displayBigText(damages.resultInfo.text, damages.resultInfo.type);
        }
        if (
          !this.creaturePositions[attackerId] ||
          !this.creaturePositions[attackerId]
        ) {
          return;
        }
        this.creaturePositions[attackerId].animation = null;
        this.creaturePositions[defenderId].animation = null;
        await wait(50);
        this.creaturePositions[attackerId].animation = ANIMATIONS.ATTACKING;
        this.creaturePositions[defenderId].animation = ANIMATIONS.BEING_HIT;
        this.addFloatingCombatText(defenderId, attackerDamageDealt);
        this.updateCreatureState(defenderId);
        await wait(150);
      }
    },
    async defenderRetaliates(damages) {
      if (!damages.defenderDamageDealt) {
        return;
      }
      for (const defenderDamageDealt of damages.defenderDamageDealt) {
        const attackerId = damages.attackerId;
        const defenderId = damages.defenderId;
        if (
          !this.creaturePositions[attackerId] ||
          !this.creaturePositions[attackerId] ||
          !damages.defenderDamageDealt
        ) {
          return;
        }
        this.creaturePositions[attackerId].animation = null;
        this.creaturePositions[defenderId].animation = null;
        await wait(50);
        this.creaturePositions[attackerId].animation = ANIMATIONS.BEING_HIT;
        this.creaturePositions[defenderId].animation = ANIMATIONS.ATTACKING;
        this.addFloatingCombatText(attackerId, defenderDamageDealt);
        this.updateCreatureState(attackerId);
        // update creature position
        await wait(150);
      }
    },
    async attackerGoesBack(damages) {
      const attackerId = damages.attackerId;
      const defenderId = damages.defenderId;
      if (
        !this.creaturePositions[attackerId] ||
        !this.creaturePositions[attackerId]
      ) {
        return;
      }
      this.creaturePositions[attackerId].animation = null;
      this.creaturePositions[defenderId].animation = null;
      this.creaturePositions[attackerId].stance = STANCES.IDLE;
      this.creaturePositions[defenderId].stance = STANCES.IDLE;
      this.creaturePositions[attackerId].current = {
        ...this.creaturePositions[attackerId].initial,
      };
      // update creature position
      await wait(100);
    },

    addFloatingCombatText(creatureId, damageInfo) {
      this.floatingCombatId = this.floatingCombatId || 0;
      const currentId = ++this.floatingCombatId;
      this.floatingCombatTexts[creatureId] =
        this.floatingCombatTexts[creatureId] || [];
      this.floatingCombatTexts[creatureId].push({
        floatingCombatId: currentId,
        damageInfo: {
          ...damageInfo,
          effects: damageInfo.effects.filter((e) => !e.durationTurns),
          effectsCombat: damageInfo.effects.filter((e) => !!e.durationTurns),
        },
      });
      setTimeout(() => {
        this.floatingCombatTexts[creatureId].shift();
      }, 2000);
    },

    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION);
    },

    updateConsideredAP() {
      ControlsService.updateConsideredAP(this.operation.context.unitCost);
    },

    updateCreatureState(creatureId) {
      if (this.creatures[creatureId]) {
        this.displayedCreatures[creatureId] = this.creatures[creatureId];
      } else {
        // TODO: no longer in combat. Do something?
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../utils.scss";

$avatar-size: 9rem;
$effects-size: 6rem;

.combat-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background-size: cover;
  background-position: center center;
}

.main-area {
  position: relative;
  display: flex;
  flex-grow: 1;
}

.creatures {
  transform: translateZ(0);
  border: 1rem solid transparent;
  margin: calc($avatar-size / 2 + $effects-size) calc($avatar-size / 2 + 2rem)
    calc($avatar-size / 2 + 4rem);
  flex-grow: 1;
}

@keyframes attack-from-left {
  0% {
    left: 0;
  }
  50% {
    left: 1rem;
  }
  100% {
    left: 0;
  }
}
@keyframes attack {
  0% {
    right: 0;
  }
  50% {
    right: 1rem;
  }
  100% {
    right: 0;
  }
}
@keyframes fleeing-hostile {
  0% {
    margin-left: -4.5rem;
    opacity: 1;
  }
  100% {
    margin-left: 10rem;
    opacity: 0;
  }
}
@keyframes fleeing {
  0% {
    margin-left: -4.5rem;
    opacity: 1;
  }
  100% {
    margin-left: -14.5rem;
    opacity: 0;
  }
}
@keyframes fleeing-indicator-up {
  0% {
    transform-origin: center center;
    transform: scale(1);
  }
  50% {
    transform-origin: center center;
    transform: scale(1.5);
  }
  100% {
    transform-origin: center center;
    transform: scale(1);
  }
}
@keyframes being-hit {
  //0% {
  //  top: 0;
  //}
  //10% {
  //  top: 0.1rem;
  //}
  //30% {
  //  top: -0.1rem;
  //}
  //50% {
  //  top: 0.1rem;
  //}
  //70% {
  //  top: -0.1rem;
  //}
  //90% {
  //  top: 0.1rem;
  //}
  //100% {
  //  top: 0;
  //}
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(1deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes floating-text {
  0% {
    margin-right: 0;
    margin-top: 3rem;
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    margin-right: 4rem;
    margin-top: 6rem;
    opacity: 0;
  }
}
@keyframes floating-text-hostile {
  0% {
    margin-left: 0;
    margin-top: 3rem;
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    margin-left: 4rem;
    margin-top: 6rem;
    opacity: 0;
  }
}

.creature {
  transition: all 0.2s ease-in;
  transition-property: left, top, z-index;

  @include iOSOnly() {
    transition: none;
  }

  margin: calc($avatar-size / -2);
  position: absolute;
  display: inline-block;

  .flee-indicator {
    position: absolute;
    z-index: 12;
    bottom: -1.2rem;
    right: 2.8rem;
    pointer-events: none;

    .percentage {
      position: absolute;
      bottom: 2rem;
      left: 2.5rem;
      font-size: 75%;
      color: #080808;
      animation: fleeing-indicator-up 0.5s linear forwards;
      transform-origin: center center;
      @include text-outline(black, #bbb);
      @include filter-fix();
    }

    .flee-icon {
      position: absolute;
      width: 6rem;
      height: 6rem;
      background-size: 100% 100%;
      bottom: 0;
      left: 0;
    }
  }

  &.fled {
    animation: fleeing 2s ease-in;
    animation-fill-mode: forwards;

    &.hostile {
      animation-name: fleeing-hostile;
    }
  }

  &:not(.hostile) {
    .flee-indicator {
      right: initial;
      left: -2.8rem;

      .percentage {
        left: 1rem;
      }

      .flee-icon {
        transform: scaleX(-1);
      }
    }
  }

  .avatar {
    position: relative;
  }

  .effects-wrapper {
    overflow: hidden;
    width: 12rem;
    position: absolute;
    bottom: 100%;
    pointer-events: none;
  }

  &.animation-attacking {
    .avatar {
      animation: attack 0.2s ease-in-out 1;
    }
  }
  &.animation-attacking.from-left {
    .avatar {
      animation: attack-from-left 0.2s ease-in-out 1;
    }
  }
  &.animation-being-hit {
    .avatar {
      animation: being-hit 0.1s ease-in-out 3;
      animation-delay: 0.1s;
    }
  }
  &.hostile.from-left,
  &:not(.hostile).from-right {
    .avatar {
      transform: scaleX(-1);
    }
  }
}

.status-actions-bar {
  width: 0;
}

.combat-summary {
  flex-grow: 1;
  max-height: var(--app-height);
  display: flex;
}

.effects-container {
  overflow: hidden;
}

.effects {
  display: flex;
  overflow: visible;
}

.paused-modal-text {
  font-style: italic;

  em {
    font-weight: bold;
    font-style: normal;
  }
}

$side-position: 1rem;
.floating-combat-text {
  pointer-events: none;
  $shadow: 0 0 0.5rem 0.5rem;
  position: absolute;
  z-index: 200;
  top: 0;
  right: $side-position;
  animation: floating-text 2s linear forwards;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
  $padding: 0.3rem;
  padding: $padding;
  border-radius: $padding;

  @include iOSOnly() {
    animation: none;
    margin-left: 1rem;
    margin-top: -3rem;
  }

  .no-damage {
    font-size: 70%;
    @include text-outline();
    white-space: nowrap;
  }
}

.creature.hostile {
  .floating-combat-text {
    right: auto;
    left: $side-position;
    animation: floating-text-hostile 2s linear forwards;
  }
}

.icon {
  width: 5rem;
  height: 5rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.markers {
  pointer-events: none;
  position: absolute;
  $size: 2.5rem;
  top: calc(0.8rem - $size / 2);
  left: 50%;
  margin-left: calc($size / -2);
  z-index: 11;

  .marker {
    position: absolute;
    top: 0;
    left: 0;
    width: $size;
    height: $size;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    @include filter(drop-shadow(0 0 0.1rem black));
    &.current-turn {
    }
  }
}

.targetting-overlay {
  position: absolute;
  @include fill();
  background: rgba(0, 0, 0, 0.8);
  z-index: 200;
  padding: 1rem;

  .text {
    @include text-outline();
    text-align: center;
    padding: 1rem;
  }
}

.top-controls {
  height: 0;
  position: relative;
  z-index: 500;

  .big-text {
    pointer-events: none;
    position: absolute;
    z-index: 6;
    bottom: -12rem;
    width: 100%;
    text-align: center;
    font-size: 300%;
    @include filter(drop-shadow(0.2rem 0.2rem 0.1rem black));

    &.default {
      @include text-outline();
    }
    &.neutral {
      @include text-outline(black, deepskyblue);
    }
    &.great {
      @include text-outline(black, green);
    }
    &.good {
      @include text-outline(black, limegreen);
    }
    &.poor {
      @include text-outline(black, yellow);
    }
    &.bad {
      @include text-outline(black, firebrick);
    }
  }

  .turn-timer {
    position: absolute;
    z-index: 3;
    bottom: 0;
    width: 100%;
  }
}

.not-your-turn {
  opacity: 0.5;
  pointer-events: none;
}

.skip-confirm {
  overflow: visible;
  position: relative;
  height: 0;
  top: -0.7rem;
  padding-left: 1rem;
}

.move-info {
  font-size: 90%;
  min-width: 28vw;
  max-width: 35vw;
  position: absolute;
  padding: 0.5rem;
  bottom: 2.75rem;
  left: 0.25rem;
  height: auto !important;
  max-height: calc(100% - 2.5rem) !important;
  z-index: 20;
}

.gained-text {
  padding-top: 1rem;
  display: block;
  @include text-good();
}

.skipping-button {
  position: fixed;
  top: 1rem;
  right: 1rem;
}

em {
  color: black;
  font-weight: bold;
}

.auto-resolve-count {
  text-align: center;
  @include text-outline();
}

.game-help-container {
  position: absolute;
  bottom: 2.8rem;
  right: 0.3rem;
}
.move-preview-close {
  position: absolute;
  top: 0;
  right: 0;
}

.item-combat-moves {
  font-size: 0.6rem !important;
}
</style>
