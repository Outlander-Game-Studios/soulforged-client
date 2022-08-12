import "./local-storage.js";

let messagesStreams = {};
let messagesStreamsFinal = {};
let lastReadTimestampStreams = {};
let expireMessagesAgoMs = null;

function chatCacheKey(locationId) {
  return `chat_${locationId}`;
}
function chatLastModeratedOn(locationId) {
  return `chat_${locationId}_moderated`;
}

function addMessages(locationId, messages) {
  messagesStreams[locationId]?.first().subscribe((oldMessages) => {
    messagesStreams[locationId].next([
      ...oldMessages,
      ...messages.map((message) => ({
        ...message,
        formattedTime: GameService.formatServerTime(message.when),
      })),
    ]);
  });
}

function buildLastReadTimestampStream(locationId) {
  if (!lastReadTimestampStreams[locationId]) {
    lastReadTimestampStreams[locationId] = new Rx.ReplaySubject(1);

    const chatLastReadKey = `chat_${locationId}_unread`;
    const storedValue = +LocalStorageService.getItem(chatLastReadKey) || 0;

    GameService.request(REQUEST_CODES.CHAT_GET_LAST_READ).then(
      (serverValue) => {
        lastReadTimestampStreams[locationId].next(
          Math.max(storedValue, serverValue)
        );
      }
    );
  }
  return lastReadTimestampStreams[locationId];
}

function fetchMessages(locationId, lastMessageWhen) {
  GameService.request(REQUEST_CODES.CHAT_GET_MESSAGES, {
    sinceWhenMs: lastMessageWhen,
  }).then(({ expireMs, messages, moderatedOn }) => {
    expireMessagesAgoMs = new Date().getTime() - expireMs;

    if (
      moderatedOn &&
      moderatedOn !==
        LocalStorageService.getItem(chatLastModeratedOn(locationId))
    ) {
      messagesStreams[locationId].next([]);
      LocalStorageService.setItem(chatLastModeratedOn(locationId), moderatedOn);
      fetchMessages(locationId);
    } else {
      addMessages(locationId, messages);
    }
  });
}

function buildMessageStream(locationId) {
  if (!messagesStreams[locationId]) {
    console.log(`Making chat stream for ${locationId}`);
    messagesStreams = {};
    messagesStreams[locationId] = new Rx.ReplaySubject(1);
    messagesStreams[locationId].next([]);

    const chatKey = chatCacheKey(locationId);
    const cachedMessages = LocalStorageService.getItem(chatKey) || [];
    addMessages(locationId, cachedMessages);
    const lastMessageWhen = cachedMessages.last()?.when;

    fetchMessages(locationId, lastMessageWhen);

    messagesStreamsFinal[locationId] = messagesStreams[locationId]
      .startWith(null)
      .map((messages) => {
        if (messages && expireMessagesAgoMs) {
          return messages.filter(
            (m) => m.when > new Date().getTime() - expireMessagesAgoMs
          );
        }
        return messages;
      })
      .tap((messages) => {
        if (messages) {
          LocalStorageService.setItem(chatKey, messages);
        }
      })
      .shareReplay(1);
  }
  return messagesStreamsFinal[locationId];
}

export const ChatService = (window.ChatService = {
  getMessagesStream() {
    return GameService.getLocationStream()
      .pluck("id")
      .switchMap((id) => buildMessageStream(id));
  },

  getLastReadTimestampStream() {
    return GameService.getLocationStream()
      .pluck("id")
      .switchMap((id) => buildLastReadTimestampStream(id));
  },

  setLastReadTimestamp(value) {
    GameService.request(REQUEST_CODES.CHAT_SET_LAST_READ, {
      whenMs: value,
    });
    GameService.getLocationStream()
      .pluck("id")
      .first()
      .subscribe((locationId) => {
        buildLastReadTimestampStream(locationId);
        lastReadTimestampStreams[locationId].next(value);
      });
  },

  getUnreadMessagesCountStream() {
    return GameService.getLocationStream()
      .pluck("id")
      .switchMap((id) =>
        Rx.combineLatest(
          buildMessageStream(id),
          buildLastReadTimestampStream(id)
        )
      )
      .map(([messages, lastReadTimestamp]) => {
        return (messages || []).filter((m) => m.when > lastReadTimestamp)
          .length;
      });
  },
});

GameService.registerHandler(
  REQUEST_CODES.CHAT_NEW_MESSAGE,
  ({ locationId, message }) => {
    addMessages(locationId, [message]);
  }
);
