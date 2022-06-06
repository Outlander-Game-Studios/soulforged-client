import backdropImage from "./assets/backdrop.jpg";
import "./@utils.js";

mockEntity("location", () => ({
  backdrop: backdropImage,
  paths: [
    mockEntityId("path1"),
    mockEntityId("path2"),
    mockEntityId("path3"),
    mockEntityId("path4"),
  ],
  creatures: [
    mockEntityId("mainEntity"),
    mockEntityId("mob1"),
    mockEntityId("mob1"),
  ],
  resources: [mockEntityId("resource1"), mockEntityId("resource2")],
  inventory: [mockEntityId("itemToolWeapon"), mockEntityId("itemFood2")],
  structures: [
    mockEntityId("structureNoTool"),
    mockEntityId("structureOperational"),
    mockEntityId("structureNonOperational1"),
    mockEntityId("structureNonOperational2"),
  ],
  actions: [
    {
      actionId: "wait",
      actionPoints: 600,
      label: "Wait",
      parameters: [],
    },
  ],
}));
