export interface UserDto {
  name: string;
  email: string;
  password: string;
  origin: string;
  grantAccessGenia: Map<string, boolean>;
}
