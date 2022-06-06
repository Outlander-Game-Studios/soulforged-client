import "./@utils.js";
import avatarAssets from "./assets/avatar/avatar-assets.js";
import avatarAssets2 from "./assets/avatar/avatar-assets-2.js";

mockEntity("avatar", () => ({
  avatarAssets,
}));

mockEntity("avatar2", () => ({
  avatarAssets: avatarAssets2,
}));
