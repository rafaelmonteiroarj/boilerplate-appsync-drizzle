export interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}
