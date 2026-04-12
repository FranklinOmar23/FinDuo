const STORAGE_KEY = "finduo-pending-invite";

export const getPendingInviteCode = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(STORAGE_KEY);
  return value ? value.trim().toUpperCase() : null;
};

export const setPendingInviteCode = (inviteCode: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, inviteCode.trim().toUpperCase());
};

export const clearPendingInviteCode = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};

export const buildInviteLink = (inviteCode: string) => {
  const normalizedInviteCode = inviteCode.trim().toUpperCase();

  if (typeof window === "undefined") {
    return `/#/invite/${normalizedInviteCode}`;
  }

  return `${window.location.origin}/#/invite/${normalizedInviteCode}`;
};