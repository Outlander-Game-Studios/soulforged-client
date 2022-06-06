const mockMessages = [
  {
    whoId: mockEntityId("mainEntity"),
    emo: ":)",
    when: new Date("2021-02-15 12:22:12").getTime(),
    msg: "Hi there!",
  },
  {
    whoId: mockEntityId("mainEntity2"),
    emo: ":)",
    when: new Date("2021-02-15 12:22:15").getTime(),
    msg: "What's up?",
  },
  {
    whoId: mockEntityId("mainEntity"),
    emo: ":D",
    when: new Date("2021-02-15 12:22:18").getTime(),
    msg: "I found a pet",
  },
  {
    whoId: mockEntityId("mainEntity2"),
    emo: ":O",
    when: new Date("2021-02-15 12:23:22").getTime(),
    msg: "Wow, nice!",
  },
];

GameService.mockRequest(REQUEST_CODES.CHAT_GET_MESSAGES, (params) => {
  const { sinceWhenMs } = params;
  return {
    messages: [...mockMessages, ...(storyMocks.chatMocks || [])].filter(
      (message) => !sinceWhenMs || message.when > sinceWhenMs
    ),
  };
});
