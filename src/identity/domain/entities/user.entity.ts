export interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  password?: string;
  questionlimitQuota: number;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  origin: string;
  grantAccessGenia: Map<string, boolean>;
}
