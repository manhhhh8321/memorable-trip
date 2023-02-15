import { BaseModel } from 'src/base/base.entity';
import { UserType } from 'src/enums/user.enum';
import { EncryptHelper } from 'src/helpers/encrypt.helper';
import { Agent } from 'src/modules/agent/entity/agent.entity';
import { Booking } from 'src/modules/booking/entity/booking.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

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

  @BeforeInsert()
  @BeforeUpdate()
  async hashing() {
    await EncryptHelper.hash(this.password);
  }

  @OneToOne(() => Agent)
  @JoinColumn()
  agent: Agent;

  @OneToMany((type) => Booking, (booking) => booking.user)
  booking: Booking[];
}
