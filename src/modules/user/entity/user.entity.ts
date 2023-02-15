import { BaseModel } from 'src/base/base.entity';
import { UserType } from 'src/enums/user.enum';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseModel {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column()
  phone: string;

  @Column()
  gender: string;

  @Column()
  password: string;
}
