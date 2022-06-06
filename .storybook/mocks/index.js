import { modifyEntity, cloneEntityPayloadId } from "./@utils.js";
import "./@main-entity.js";
import "./@trade.js";
import "./@avatar.js";
import "./@mob.js";
import "./@chat.js";
import "./@structure.js";
import "./@farm.js";
import "./@resource.js";
import "./@path.js";
import "./@item.js";
import "./@combat.js";
import "./@knowledge-base.js";
import { effects } from "./@effects.js";
import { operations } from "./@operations.js";
import { crafts, plans } from "./@recipes.js";

global.storyMocks = {
  effects,
  operations,
  crafts,
  plans,
  modifyEntity,
  cloneEntityPayloadId,
};

allIdsGenerated();
