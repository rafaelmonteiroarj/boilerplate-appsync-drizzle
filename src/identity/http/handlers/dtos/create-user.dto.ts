export class CreateUserDTO {
  name!: string;
  email!: string;
  isActive?: boolean;
  isAdmin?: boolean;
  password!: string;
}
