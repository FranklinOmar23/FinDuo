export interface Contribution {
  id: string;
  coupleId: string;
  userId: string;
  amount: number;
  savingsReserved: number;
  contributionDate: string;
  note: string | null;
  createdAt: string;
}

export interface ContributionFilters {
  month?: string;
}
