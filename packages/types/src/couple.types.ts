export interface CoupleMemberSummary {
  userId: string;
  fullName: string | null;
  role: string;
}

export interface Couple {
  id: string;
  name: string;
  inviteCode: string;
  isSolo: boolean;
  savingsPercent: number;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CoupleSummary {
  id: string;
  name: string;
  inviteCode: string;
  isSolo: boolean;
  savingsPercent: number;
  membersCount: number;
  members: CoupleMemberSummary[];
}
