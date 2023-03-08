import { BaseModel } from 'src/base/base.entity';
import { UserType } from 'src/enums/user.enum';
import { EncryptHelper } from 'src/helpers/encrypt.helper';
import { Owner } from 'src/entities/owner.entity';
import { Booking } from 'src/entities/booking.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { GenderEnum } from 'src/enums/base.enum';

@Entity()
export class User extends BaseModel {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.CLIENT,
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

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  phone: string;

  @Column()
  gender: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    default: false,
    type: 'boolean',
  })
  isVerified: boolean;

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashing() {
  //   try {
  //     this.password = await EncryptHelper.hash(this.password, 10);
  //   } catch (e) {
  //     throw new Error('Error Encrypting Password');
  //   }
  // }

  @OneToOne(() => Owner)
  @JoinColumn()
  owner: Owner;

  @OneToMany((type) => Booking, (booking) => booking.user)
  booking: Booking[];
}
