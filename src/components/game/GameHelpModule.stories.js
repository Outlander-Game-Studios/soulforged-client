export default {
  title: "Game UI/Game Help",
};

export const base = () => {
  setTimeout(() => {
    document.querySelector(".help-trigger .help-button").click();
  });
  return mockComponent({
    template: `<GameHelpModule />`,
  })();
};

export const coreConcepts = () => {
  setTimeout(() => {
    document.querySelector(".help-trigger .help-button").click();
    setTimeout(() => {
      document.querySelectorAll(".modal button")[1].click();
    });
  });
  return mockComponent({
    template: `<GameHelpModule />`,
  })();
};
