import { Exclude } from 'class-transformer';
import { BaseModel } from 'src/base/base.entity';
import { UserType } from 'src/enums/user.enum';
import { EncryptHelper } from 'src/helpers/encrypt.helper';
import { BeforeInsert, BeforeUpdate, Column, DeleteDateColumn, Entity } from 'typeorm';

@Entity()
export class Account extends BaseModel {
  @Column({
    type: 'text',
    length: 255,
    nullable: false,
  })
  userName: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.CLIENT,
  })
  userType: UserType;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  password: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await EncryptHelper.hash(this.password);
  }
}
