export interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  password?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}
