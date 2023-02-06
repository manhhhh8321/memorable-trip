import { Column, Entity, DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseModel } from 'src/base/base.entity';
import { StatusEnum } from 'src/enums/base.enum';
import { UserType } from 'src/enums/user.enum';
import { EncryptHelper } from 'src/helpers/encrypt.helper';

@Entity('user')
export class User extends BaseModel {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'varchar',
    length: 60,
    unique: true,
    nullable: false,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  password: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.InActive,
  })
  status?: StatusEnum;

  @Column({
    name: 'userType',
    type: 'enum',
    enum: UserType,
    default: UserType.CLIENT,
  })
  userType?: UserType;

  // Remove or apply another table if need permissions
  @Column({
    name: 'permissions',
    type: 'varchar',
    nullable: true,
  })
  permissions?: Array<string>;

  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await EncryptHelper.hash(this.password);
  }
}
