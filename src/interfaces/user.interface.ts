import { UserType } from 'src/enums/user.enum';

export interface IUser {
  id: number;
  userType: UserType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
}
