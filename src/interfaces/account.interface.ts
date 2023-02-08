import { UserType } from 'src/enums/user.enum';

export interface IAccount {
  id: number;
  username: string;
  password: string;
  userType: UserType;
}
