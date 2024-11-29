export interface UserQuota {
  id: string;
  name: string;
  email: string;
  questionlimitQuota: number;
  remainingQuota: number;
  usedQuota: number;
  isAdmin: boolean;
}
