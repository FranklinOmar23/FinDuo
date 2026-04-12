const INTRO_KEY_PREFIX = "finduo-mascot-intro-seen";
const EVENT_KEY_PREFIX = "finduo-mascot-event-seen";

export const hasSeenMascotIntro = (userId: string) => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(`${INTRO_KEY_PREFIX}:${userId}`) === "1";
};

export const markMascotIntroAsSeen = (userId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(`${INTRO_KEY_PREFIX}:${userId}`, "1");
};

const getEventStorageKey = (userId: string, eventKey: string) => `${EVENT_KEY_PREFIX}:${userId}:${eventKey}`;

export const getMascotEventSeenAt = (userId: string, eventKey: string) => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(getEventStorageKey(userId, eventKey));

  if (!rawValue) {
    return null;
  }

  const parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

export const markMascotEventSeen = (userId: string, eventKey: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getEventStorageKey(userId, eventKey), String(Date.now()));
};

export const shouldShowMascotEvent = (userId: string, eventKey: string, cooldownHours = 24) => {
  const lastSeenAt = getMascotEventSeenAt(userId, eventKey);

  if (!lastSeenAt) {
    return true;
  }

  return Date.now() - lastSeenAt >= cooldownHours * 60 * 60 * 1000;
};