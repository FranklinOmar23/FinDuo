export interface BalanceSettlementRecord {
  id: string;
  coupleId: string;
  settledAt: string;
  amount: number;
  baselineDifference: number;
  payerUserId: string;
  payerName: string;
  receiverUserId: string;
  receiverName: string;
}

interface SaveBalanceSettlementInput {
  coupleId: string;
  amount: number;
  baselineDifference: number;
  payerUserId: string;
  payerName: string;
  receiverUserId: string;
  receiverName: string;
}

const STORAGE_KEY = "finduo-balance-settlements";

const loadBalanceSettlements = (): BalanceSettlementRecord[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as BalanceSettlementRecord[];
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

const persistBalanceSettlements = (records: BalanceSettlementRecord[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const getBalanceSettlementHistory = (coupleId: string) => {
  return loadBalanceSettlements()
    .filter((record) => record.coupleId === coupleId)
    .sort((left, right) => new Date(right.settledAt).getTime() - new Date(left.settledAt).getTime());
};

export const getLatestBalanceSettlement = (coupleId: string) => {
  return getBalanceSettlementHistory(coupleId)[0] ?? null;
};

export const saveBalanceSettlement = (input: SaveBalanceSettlementInput) => {
  const records = loadBalanceSettlements();
  const nextRecord: BalanceSettlementRecord = {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    coupleId: input.coupleId,
    settledAt: new Date().toISOString(),
    amount: input.amount,
    baselineDifference: input.baselineDifference,
    payerUserId: input.payerUserId,
    payerName: input.payerName,
    receiverUserId: input.receiverUserId,
    receiverName: input.receiverName
  };

  persistBalanceSettlements([nextRecord, ...records].slice(0, 120));
  return nextRecord;
};