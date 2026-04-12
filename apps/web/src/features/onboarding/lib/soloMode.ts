const SOLO_MODE_KEY = "finduo-solo-mode";

export const hasAcceptedSoloMode = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(SOLO_MODE_KEY) === "accepted";
};

export const acceptSoloMode = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SOLO_MODE_KEY, "accepted");
};

export const clearSoloMode = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SOLO_MODE_KEY);
};